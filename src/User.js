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
 * @prop {string | null | undefined} [code2FA=undefined] If the provided value is typeof `string`, it's considered as a 2FA code (should be provided after first unsuccessful login). If it's `null` the 2FA will be skipped. If omitted or `undefined` and the 2FA is requested by the Edupage, the function will resolve with `null`.
 * @prop {string} [user] Can be used to select a specific user in case there are more.
 * @prop {string} [edupage=""] The edupage subdomain (origin) to login to. Try to set this if you have trouble logging in (e.g. incorrect password error).
 */


class User extends RawData {
	/**
	 * Creates an instance of User.
	 * @param {RawDataObject} [data={}] Raw data to initialize the instance with.
	 * @param {Edupage} [edupage=null] Edupage instance to use.
	 * @memberof User
	 */
	constructor(data = {}, edupage = null) {
		super(data);

		/**
		 * Edupage instance associated to this object.
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
	 * Initializes instance with raw data
	 * @param {Edupage} [edupage=null]
	 * @memberof Class
	 */
	init(edupage = null) {
		if(edupage) this.edupage = edupage;

		this.origin = this.edupage.user.origin;
	}

	/**
	 * @typedef {Object} PollOption
	 * @prop {string} text Text of the option.
	 * @prop {string} [id] Id of the option. If not provided, a new one will be generated.
	 */

	/**
	 * @typedef {Object} PollOptions
	 * @prop {PollOption[]} options Options to be added to the poll.
	 * @prop {boolean} [multiple=false] If `true` multiple choices can be selected.
	 */

	/**
	 * @typedef {Object} MessageOptions
	 * @prop {string} text Text of the message.
	 * @prop {boolean} [important=false] If `true` the message will be marked as important. You will also be able to track who has read the message.
	 * @prop {boolean} [parents=false] If `true` the message will be sent to student as well as their parents.
	 * @prop {boolean} [allowReplies=true] Allows to disable replies to the message.
	 * @prop {boolean} [repliesToAuthorOnly=false] Allows to reply only to the author of the message. By default, replies are sent to all users.
	 * @prop {Attachment[]} [attachments=[]] Attachments to be added to the message.
	 * @prop {PollOptions} [poll] Poll to be added to the message.
	 */

	/**
	 * Sends a message to the user
	 * @param {MessageOptions} options Message options
	 * @this {User | Teacher | Student | Parent}
	 * @memberof User
	 */
	async sendMessage(options) {
		const {
			text = "",
			important = false,
			parents = false,
			allowReplies = true,
			repliesToAuthorOnly = false,
			attachments = [],
			poll = null
		} = options;

		if(!this.edupage) throw new EdupageError(`User does not have assigned Edupage instance yet`);

		//Post message
		const hasPoll = poll && poll.options && poll.options;
		const res = await this.edupage.api({
			url: ENDPOINT.TIMELINE_CREATE_ITEM,
			data: {
				attachements: JSON.stringify(attachments.reduce((a, b) => ({...a, ...b.toJSON()}), {})),
				receipt: important ? "1" : "0",
				repliesDisabled: !allowReplies ? "1" : "0",
				repliesToAllDisabled: !allowReplies || repliesToAuthorOnly ? "1" : "0",
				selectedUser: this.getUserString(parents),
				text: text,
				typ: TIMELINE_ITEM_TYPE.MESSAGE,
				votingParams: hasPoll ? JSON.stringify({
					"answers": poll.options.map(e => ({
						text: e.text,
						id: e.id || Math.random().toString(16).slice(2)
					})),
					"multiple": false
				}) : undefined
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
	 * Logs in the user. Provide third parameter as login options if you have troubles logging in.
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
		if(!options.user) options.user = undefined;

		//Create a new CookieJar instance to store required cookies
		this.cookies = new CookieJar();

		return new Promise((resolve, reject) => {
			debug(`[Login] Logging in as ${username}...`);

			const payload = {
				"m": username,
				"h": password,
				"edupage": options.edupage || "",
				"plgc": null,
				"ajheslo": "1",
				"hasujheslo": "1",
				"ajportal": "1",
				"ajportallogin": "1",
				"mobileLogin": "1",
				"version": "2020.0.18",
				"fromEdupage": options.edupage || "",
				"device_name": null,
				"device_id": null,
				"device_key": "",
				"os": null,
				"murl": null,
				"edid": ""
			};

			const loginServer = options.edupage || "login1";
			const skip2Fa = options.code2FA === null;
			if(typeof options.code2FA === "string") payload.t2fasec = options.code2FA;

			fetch(`https://${loginServer}.edupage.org/login/mauth`, {
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
						reject(new LoginError(`Failed to login: Incorrect username. (If you are sure that the username is correct, try providing 'edupage' option)`));
					} else {
						reject(new LoginError(`Failed to login: Incorrect password. (If you are sure that the password is correct, try providing 'edupage' option)`));
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
					if(options.user) {
						const user = json.users.find(user => user.userid == options.user);

						if(user) {
							debug(`[Login] Selected user by 'user' option`);
							selectedUser = user;
						}
					}
					if(!selectedUser) {
						error(`[Login] No user selected`);
						return reject(new LoginError(`Multiple users found: ${json.users.map(user => `${user.userid} (${user.firstname} ${user.lastname})`).join(", ")}. Please, pass the selected user as 'user' option to login options.`));
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
	 * Retruns Edupage's representation of the user id.
	 * @return {string} Userstring
	 * @memberof User
	 */
	getUserString() {
		return this.userString;
	}

	/**
	 * Creates an instance of Student or Teacher from user data.
	 * @static
	 * @param {string} userString Userstring to create an instance of
	 * @param {RawDataObject} [data={}] Raw data to use for the instance
	 * @param {Edupage} [edupage=null] Edupage instance to use for the instance
	 * @return {User | Teacher | Student | Parent} User instance
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
	 * Parses the user string to provide some useful information
	 * @static
	 * @param {string} userString Userstring to parse
	 * @return {{id: string, type: EntityType, wildcard: boolean}} Parsed userstring
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