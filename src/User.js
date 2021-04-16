module.exports = null;
const debug = require("debug")("edupage:log");
const error = require("debug")("edupage:error");
const {default: fetch} = require("node-fetch");
const CookieJar = require("../lib/CookieJar");
const {LoginError, ParseError, EdupageError, APIError, MessageError} = require("./exceptions");
const {GENDER, ENDPOINT, ENTITY_TYPE} = require("./enums");
const Edupage = require("./Edupage");
const RawData = require("../lib/RawData");
const Attachement = require("./Attachement");

debug.log = console.log.bind(console);

/**
 * @typedef {import("./Teacher")} Teacher
 */
/**
 * @typedef {import("./Student")} Student
 */
/**
 * @typedef {import("./Parent")} Parent
 */
/**
 * @typedef {import("./Message")} Message
 */
/**
 * @typedef {import("./enums").EntityType} EntityType
 */

class User extends RawData {
	/**
	 * Creates an instance of User.
	 * @param {import("../lib/RawData").RawDataObject} [data={}]
	 * @param {Edupage} [edupage=null]
	 * @memberof User
	 */
	constructor(data = {}, edupage = null) {
		super(data);

		/**
		 * Edupage instance
		 * @type {Edupage} 
		 */
		this.edupage = edupage;

		/**
		 * @type {Date}
		 */
		this.dateFrom = data.datefrom ? new Date(data.datefrom) : null;

		/**
		 * @type {Date}
		 */
		this.dateTo = data.dateto ? new Date(data.dateto) : null;

		/**
		 * @type {string}
		 */
		this.firstname = data.firstname;

		/**
		 * @type {string}
		 */
		this.lastname = data.lastname;

		/**
		 * @type {GENDER}
		 */
		this.gender = data.gender;

		/**
		 * @type {string}
		 */
		this.id = data.id;

		/**
		 * @type {string}
		 */
		this.userString = null;

		/**
		 * @type {boolean}
		 */
		this.isOut = data.isOut;

		/**
		 * @type {string}
		 */
		this.origin = null;

		/**
		 * @type {{username: string, password: string}}
		 */
		this.credentials = null;

		/**
		 * @type {CookieJar}
		 */
		this.cookies = null;

		/**
		 * @type {boolean}
		 */
		this.isLoggedIn = false;

		/**
		 * @type {string}
		 */
		this.email = null;

		if(this.edupage) User.prototype.init.call(this);
	}

	/**
	 * 
	 * @param {Edupage} [edupage=null]
	 * @memberof Class
	 */
	init(edupage = null) {
		if(edupage) this.edupage = edupage;

		this.origin = this.edupage.user.origin;
	}

	/**
	 * @typedef {Object} MessageOptions
	 * @prop {string} text
	 * @prop {boolean} [important=false]
	 * @prop {boolean} [parents=false]
	 * @prop {Attachement[]} [attachements=[]]
	 */

	/**
	 * 
	 * @param {MessageOptions} options
	 * @this {User|Teacher|Student|Parent}
	 * @memberof User
	 */
	async sendMessage(options) {
		const {
			text = "",
			important = false,
			parents = false,
			attachements = []
		} = options;

		if(!this.edupage) throw new EdupageError(`User does not have assigned Edupage instance yet`);

		//Post message
		const res = await this.edupage.api({
			url: ENDPOINT.TIMELINE_CREATE_ITEM,
			data: {
				attachements: JSON.stringify(attachements.reduce((a, b) => ({...a, ...b}), {})),
				receipt: (+important).toString(),
				selectedUser: this.getUserString(parents),
				text: text,
				typ: "sprava"
				//TODO: add polls support
			}
		});

		//Request failed
		if(res.status !== "ok") {
			error(`Received invalid status from the server '${res.status}'`);
			throw new APIError(`Failed to send message: Invalid status received '${res.status}'`, res);
		}

		//No changes
		if(!res.changes?.length) {
			error(`Failed to send message (no changes made) (${res.changes})`);
			throw new MessageError(`Failed to send message: No changes were made`, res);
		}

		//Debug
		if(res.changes.length > 1) debug(`[Message] Multiple changes after posting single message`, res.changes);

		//Return Message object
		return new (require("./Message"))(res.changes[0], this.edupage);
	}

	async login(username, password) {
		if(!username || !password) throw new LoginError(`Invalid credentials`);
		this.cookies = new CookieJar();

		return new Promise((resolve, reject) => {
			debug(`[Login] Logging in as ${username}...`);
			fetch("https://portal.edupage.org/index.php?jwid=jw3&module=Login&lang=sk", {
				"headers": {
					"accept": "*/*",
					"content-type": "application/x-www-form-urlencoded",
				},
				"body": `meno=${username}&heslo=${password}&akcia=login`,
				"method": "POST"
			}).then(res => {
				debug(`[Login] Saving received cookies...`);
				this.cookies.setCookie(res);
				return res.text();
			}).then(async html => {
				html = html.replace(/\n/g, "").replace(/\r/g, "");

				//Parse data
				debug(`[Login] Parsing html data...`);
				const err = html.match(/<div.*?class=".*?errorbox".*?>(.*?)</)?.[1]?.trim?.();
				const url = html.match(/window\.open\("(.*?)"/)?.[1];
				const origin = url?.match(/(\w*?).edupage.org/)?.[1];
				const ESID = url?.match(/(?:ESID|PSID)=(.+?)\b/)?.[1];

				//Validate parsed data
				if(origin == "portal") {
					error(`[Login] Edupage server did not redirect login request to proper origin ('${origin}')`);
					return reject(new EdupageError(`Edupage server did not redirect login request to proper origin`));
				}
				if(err) {
					error(`[Login] Error box showed:`, err);
					return reject(new LoginError(`Failed to login: ${err}`));
				}
				if(!url) {
					error(`[Login] Failed to parse redirect URL '${url}'`);
					return reject(new ParseError(`Cannot parse redirect URL`));
				}
				if(!ESID) {
					error(`[Login] Failed to parse ESID parameter from URL '${ESID}' ('${url}')`);
					return reject(new ParseError(`Cannot parse ESID parameter from URL`));
				}

				//Setup properties
				this.cookies.setCookie("PHPSESSID", ESID);
				this.origin = origin;
				this.isLoggedIn = true;

				this.credentials = {
					username,
					password
				};

				debug(`[Login] Login successful`)
				resolve(this);
			}).catch(err => {
				error(`[Login] Failed to login user:`, err);
				reject(err);
			});
		});
	}

	getUserString() {
		return this.userString;
	}

	/**
	 * Creates an instance of Student or Teacher from user data.
	 * @static
	 * @param {string} userString
	 * @param {import("../lib/RawData").RawDataObject} [data={}]
	 * @param {Edupage} [edupage=null]
	 * @return {User|Teacher|Student|Parent}
	 * @memberof User
	 */
	static from(userString, data = {}, edupage = null) {
		const {id, type} = this.parseUserString(userString);

		data.id = id || null;

		if(type == ENTITY_TYPE.TEACHER) return new (require("./Teacher"))(data, edupage);
		if(type == ENTITY_TYPE.STUDENT) return new (require("./Student"))(data, edupage);
		if(type == ENTITY_TYPE.PARENT) return new (require("./Parent"))(data, edupage);

		const user = new User(data, edupage);
		user.userString = userString;

		return user;
	}

	/**
	 *
	 * @static
	 * @param {string} userString
	 * @return {{id: string, type: EntityType, wildcard: boolean}} 
	 * @memberof User
	 */
	static parseUserString(userString) {
		const id = (userString.match(/-?\d+/) || [])[0];
		const type = ((userString.match(/[a-z]+/i) || [])[0] || "");
		const wildcard = userString.indexOf("*") > -1;

		return {id, type, wildcard};
	}
}

module.exports = User;