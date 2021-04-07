const {default: fetch} = require("node-fetch");
const CookieJar = require("../lib/CookieJar");
const {LoginError, ParseError, EdupageError} = require("./exceptions");
const {GENDER} = require("./enums");
const Edupage = require("./Edupage");
const RawData = require("../lib/RawData");

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
		this.datefrom = data.datefrom ? new Date(data.datefrom) : null;

		/**
		 * @type {Date}
		 */
		this.dateto = data.dateto ? new Date(data.dateto) : null;

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
			console.log("logging in");
			fetch("https://portal.edupage.org/index.php?jwid=jw3&module=Login&lang=sk", {
				"headers": {
					"accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
					"accept-language": "sk-SK,sk;q=0.9,cs;q=0.8,en-US;q=0.7,en;q=0.6",
					"cache-control": "max-age=0",
					"content-type": "application/x-www-form-urlencoded",
					"sec-fetch-dest": "document",
					"sec-fetch-mode": "navigate",
					"sec-fetch-site": "same-origin",
					"sec-fetch-user": "?1",
					"upgrade-insecure-requests": "1"
				},
				"referrer": "https://portal.edupage.org/index.php?jwid=jw3&module=Login&ak_jw3=login&lang=sk",
				"referrerPolicy": "same-origin",
				"body": `meno=${username}&heslo=${password}&akcia=login`,
				"method": "POST",
				"mode": "cors",
				"credentials": "include"
			}).then(res => {
				this.cookies.setCookie(res);
				return res.text();
			}).then(async html => {
				html = html.replace(/\n/g, "").replace(/\r/g, "");

				//Parse data
				const err = html.match(/<div.*?class=".*?errorbox".*?>(.*?)</)?.[1]?.trim?.();
				const url = html.match(/window\.open\("(.*?)"/)?.[1];
				const origin = url?.match(/(\w*?).edupage.org/)?.[1];
				const ESID = url?.match(/(?:ESID|PSID)=(.+?)\b/)?.[1];

				//Validate parsed data
				if(origin == "portal") return reject(new EdupageError(`Edupage server did not redirect login request to proper origin`));
				if(err) return reject(new LoginError(`Failed to login: ${err}`));
				if(!url) return reject(new ParseError(`Cannot parse redirect URL`));
				if(!ESID) return reject(new ParseError(`Cannot parse ESID parameter from URL`));

				//Setup properties
				this.cookies.setCookie("PHPSESSID", ESID);
				this.origin = origin;
				this.isLoggedIn = true;

				this.credentials = {
					username,
					password
				};

				resolve(this);
			}).catch(err => {
				reject(err);
			});
		});
	}
}

module.exports = User;