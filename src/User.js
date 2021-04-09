const debug = require("debug")("edupage:log");
const error = require("debug")("edupage:error");
const {default: fetch} = require("node-fetch");
const CookieJar = require("../lib/CookieJar");
const {LoginError, ParseError, EdupageError} = require("./exceptions");
const {GENDER} = require("./enums");
const Edupage = require("./Edupage");
const RawData = require("../lib/RawData");

debug.log = console.log.bind(console);

class User extends RawData {
	/**
	 * Creates an instance of User.
	 * @param {Object<string, any>} [data={}]
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
}

module.exports = User;