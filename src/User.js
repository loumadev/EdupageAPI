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


/**
 * @typedef {Object} LoginOptions
 * @prop {string | null | undefined} [code2FA=undefined] If the provided value is typeof `string`, it's considired as a 2FA code (should be provided after first unsuccessful login). If it's `null` the 2FA will be skipped. If omitted or `undefined` and the 2FA is requested by the Edupage, the function will resolve with `null`.
 * @prop {string} [userId] Can be used to select a specific user in case there are more. If omitted or not found by provided userId, the first user will be selected.
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
	 * @prop {Attachment[]} [attachments=[]]
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
	 * @typedef {import("../lib/ResponseTypings").MAuthResponse} MAuthResponse
	 */

	/**
	 *
	 * @param {string} username Username of the user
	 * @param {string} password Password of the user
	 * @param {LoginOptions} [options] Login options
	 * @return {Promise<User | null>} Returns a promise that resolves with the `User` object if successful. If the 2FA is requested by the Edupage, the promise will resolve with `null`. 
	 * @memberof User
	 */
	async login(username, password, options = {}) {
		if(!username || !password) throw new LoginError(`Invalid credentials`);

		//Setup options
		if(!options) options = {};
		if(!options.code2FA) options.code2FA = undefined;
		if(!options.userId) options.userId = undefined;

		//Create a new CookieJar instance to store required cookies
		this.cookies = new CookieJar();

		return new Promise((resolve, reject) => {
			debug(`[Login] Logging in as ${username}...`);

			const payload = {
				"m": username,
				"h": password,
				"edupage": "",
				"plgc": null,
				"ajheslo": "1",
				"hasujheslo": "1",
				"ajportal": "1",
				"ajportallogin": "1",
				"mobileLogin": "1",
				"version": "2020.0.18",
				"fromEdupage": "",
				"device_name": null,
				"device_id": null,
				"device_key": "",
				"os": null,
				"murl": null,
				"edid": ""
			};

			const skip2Fa = options.code2FA === null;
			if(typeof options.code2FA === "string") payload.t2fasec = options.code2FA;

			fetch("https://login1.edupage.org/login/mauth", {
				"headers": {
					"accept": "application/json, text/javascript, */*; q=0.01",
					"content-type": "application/x-www-form-urlencoded; charset=UTF-8"
				},
				"method": "POST",
				"body": new URLSearchParams(payload).toString()
			}).then(res => {
				debug(`[Login] Saving received cookies...`);
				this.cookies.setCookie(res);
				return res.json();
			}).then(async (/**@type {MAuthResponse}*/json) => {
				let selectedUser = null;

				//Error handling
				if(!json.users.length) {
					if(json.needEdupage) {
						reject(new LoginError(`Failed to login: Incorrect username. (This error might be also caused by missing edupage origin. In this case, please, open a new GitHub issue.)`));
					} else {
						reject(new LoginError(`Failed to login: Incorrect password`));
					}
					return;
				}

				//Process response
				if(json.users.length == 1) {
					if(json.users[0].need2fa == "1" && !skip2Fa) {
						if(json.t2fasec) {
							debug(`[Login] 2FA code is invalid`);
							return reject(new LoginError(`Invalid 2FA code`));
						} else {
							debug(`[Login] 2FA was requested by the Edupage`);
							return resolve(null);
						}
					} else {
						debug(`[Login] Successfully logged in`);
						selectedUser = json.users[0];
					}
				} else {
					debug(`[Login] Found multiple users with the same username`);
					if(options.userId) {
						const user = json.users.find(user => User.parseUserString(user.userid).id == options.userId);

						if(user) {
							debug(`[Login] Selected user by userId`);
							selectedUser = user;
						} else {
							debug(`[Login] Failed to select user by userId (not found), using first user`);
							selectedUser = json.users[0];
						}
					}
				}

				//Update values
				this.cookies.setCookie("PHPSESSID", selectedUser.esid);
				this.origin = selectedUser.edupage;
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