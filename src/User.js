module.exports = null;
const debug = require("debug")("edupage:log");
const error = require("debug")("edupage:error");
const {default: fetch} = require("node-fetch");
const CookieJar = require("../lib/CookieJar");
const {LoginError, ParseError, EdupageError, APIError, MessageError, FatalError} = require("./exceptions");
const {GENDER, ENDPOINT, ENTITY_TYPE, API_STATUS, TIMELINE_ITEM_TYPE} = require("./enums");
const Edupage = require("./Edupage");
const RawData = require("../lib/RawData");
const Attachment = require("./Attachment");

debug.log = console.log.bind(console);

/**
 * @typedef {import("../lib/RawData").RawDataObject} RawDataObject
 */

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
	 * @param {RawDataObject} [data={}]
	 * @param {Edupage} [edupage=null]
	 * @memberof User
	 */
	constructor(data = {}, edupage = null) {
		super(data);

		/**
		 * Edupage instance associated to this object associated to this object
		 * @type {Edupage} 
		 */
		this.edupage = edupage;

		/**
		 * Date since when the user is registered
		 * @type {Date}
		 */
		this.dateFrom = data.datefrom ? new Date(data.datefrom) : null;

		/**
		 * Date of expected leave of the user
		 * @type {Date}
		 */
		this.dateTo = data.dateto ? new Date(data.dateto) : null;

		/**
		 * Firstname of the user
		 * @type {string}
		 */
		this.firstname = data.firstname;

		/**
		 * Lastname of the user
		 * @type {string}
		 */
		this.lastname = data.lastname;

		/**
		 * Gender of the user
		 * @type {GENDER}
		 */
		this.gender = data.gender;

		/**
		 * Edupage identifier of the user in format of number
		 * @example "845796"
		 * @type {string}
		 */
		this.id = data.id;

		/**
		 * Edupage userstring of the user
		 * @example "Student845796"
		 * @type {string}
		 */
		this.userString = null;

		/**
		 * Flag marking if the user has left the school
		 * @type {boolean}
		 */
		this.isOut = data.isOut;

		/**
		 * Edupage origin of the user (subdomain)
		 * @type {string}
		 */
		this.origin = null;

		/**
		 * Login credentials of the user. Set if the user is logged in or has attempted to log in.
		 * @type {{username: string, password: string} | null}
		 */
		this.credentials = null;

		/**
		 * CookieJar object storing current session cookies for logged in user
		 * @type {CookieJar}
		 */
		this.cookies = null;

		/**
		 * Flag telling if the user is logged in
		 * @type {boolean}
		 */
		this.isLoggedIn = false;

		/**
		 * Email address of the logged in user
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
	 * @prop {Attachment[]} [attachments=[]]
	 */

	/**
	 * 
	 * @param {MessageOptions} options
	 * @this {User | Teacher | Student | Parent}
	 * @memberof User
	 */
	async sendMessage(options) {
		const {
			text = "",
			important = false,
			parents = false,
			attachments = []
		} = options;

		if(!this.edupage) throw new EdupageError(`User does not have assigned Edupage instance yet`);

		//Post message
		const res = await this.edupage.api({
			url: ENDPOINT.TIMELINE_CREATE_ITEM,
			data: {
				attachements: JSON.stringify(attachments.reduce((a, b) => ({...a, ...b.toJSON()}), {})),
				receipt: (+important).toString(),
				selectedUser: this.getUserString(parents),
				text: text,
				typ: TIMELINE_ITEM_TYPE.MESSAGE
				//TODO: add polls support
			}
		});

		//Request failed
		if(res.status !== API_STATUS.OK) {
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

	/**
	 *
	 * @param {string} username
	 * @param {string} password
	 * @return {Promise<User>} 
	 * @memberof User
	 */
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
				const origin = url?.match(/https?:\/\/(.*?).edupage.org/)?.[1];
				const ESID = url?.match(/(?:ESID|PSID)=(.+?)\b/)?.[1];

				//Validate parsed data
				const __data = {html, err, url, origin, ESID};
				if(origin == "portal") return FatalError.throw(new EdupageError("Edupage server did not redirect login request to proper origin"), __data);
				if(!url) return FatalError.throw(new ParseError("Failed to parse redirect URL"), __data);
				if(!origin) return FatalError.throw(new ParseError("Failed to parse edupage origin from redirect URL"), __data);
				if(!ESID) return FatalError.throw(new ParseError("Failed to parse ESID parameter from URL"), __data);

				//Login error occurred (usually wrong password)
				if(err) {
					error(`[Login] Error box showed:`, err);
					return reject(new LoginError(`Failed to login: ${err}`));
				}

				//Setup properties
				this.cookies.setCookie("PHPSESSID", ESID);
				this.origin = origin;
				this.isLoggedIn = true;

				this.credentials = {
					username,
					password
				};

				debug(`[Login] Login successful`);
				resolve(this);
			}).catch(err => {
				error(`[Login] Failed to login user:`, err);
				reject(err);
			});
		});
	}

	/**
	 *
	 * @return {string} UserString
	 * @memberof User
	 */
	getUserString() {
		return this.userString;
	}

	/**
	 * Creates an instance of Student or Teacher from user data.
	 * @static
	 * @param {string} userString
	 * @param {RawDataObject} [data={}]
	 * @param {Edupage} [edupage=null]
	 * @return {User | Teacher | Student | Parent}
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