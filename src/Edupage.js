const debug = require("debug")("edupage:log");
const error = require("debug")("edupage:error");
const {default: fetch} = require("node-fetch");
const Student = require("./Student");
const Teacher = require("./Teacher");
const User = require("./User");
const {btoa, iterate} = require("../lib/utils");
const {ENDPOINT} = require("./enums");
const Class = require("./Class");
const Classroom = require("./Classroom");
const Parent = require("./Parent");
const RawData = require("../lib/RawData");
const Subject = require("./Subject");
const Period = require("./Period");
const ASC = require("./ASC");
const {LoginError} = require("./exceptions");
const Timetable = require("./Timetable");

debug.log = console.log.bind(console);

class Edupage extends RawData {
	/**
	 * Creates an instance of Edupage.
	 * @memberof Edupage
	 */
	constructor() {
		super();

		/**
		 * @type {User|Teacher|Student}
		 */
		this.user = null;

		/**
		 * @type {Student[]}
		 */
		this.students = [];

		/**
		 * @type {Teacher[]}
		 */
		this.teachers = [];

		/**
		 * @type {Class[]}
		 */
		this.classes = [];

		/**
		 * @type {Classroom[]}
		 */
		this.classrooms = [];

		/**
		 * @type {Parent[]}
		 */
		this.parents = [];

		/**
		 * @type {Subject[]}
		 */
		this.subjects = [];

		/**
		 * @type {Period[]}
		 */
		this.periods = [];

		/**
		 * @type {Timetable[]}
		 */
		this.timetables = [];


		/**
		 * @type {ASC}
		 */
		this.ASC = null;

		/**
		 * @type {number}
		 */
		this.year = null;
	}

	/**
	 * Logs user in for this instance
	 *
	 * @param {string} [username=this.user.credentials.username]
	 * @param {string} [password=this.user.credentials.password]
	 * @return {Promise<User|Teacher|Student>} 
	 * @memberof Edupage
	 */
	async login(username = this.user.credentials.username, password = this.user.credentials.password) {
		return new Promise((resolve, reject) => {
			const temp = new User();
			temp.login(username, password).then(async user => {
				this.user = temp;
				await this.refresh().catch(reject);
				resolve(this.user);
			}).catch(reject);
		});
	}

	async refresh() {
		//Load global edupage data
		const _html = await this.api({url: ENDPOINT.DASHBOARD, method: "GET", type: "text"});
		const _json = Edupage.parse(_html);

		//Load timeline data
		const _timeline = await this.api({url: ENDPOINT.TIMELINE});
		const _asc = ASC.parse(_html);

		//Merge data
		this._data = {..._json, ..._timeline, ASC: _asc};

		//Parse json and create Objects
		this.students = Object.values(this._data.dbi.students).map(data => new Student(data, this));
		this.teachers = Object.values(this._data.dbi.teachers).map(data => new Teacher(data, this));
		this.classes = Object.values(this._data.dbi.classes).map(data => new Class(data, this));
		this.classrooms = Object.values(this._data.dbi.classrooms).map(data => new Classroom(data, this));
		this.parents = Object.values(this._data.dbi.parents).map(data => new Parent(data));
		this.subjects = Object.values(this._data.dbi.subjects).map(data => new Subject(data));
		this.periods = Object.values(this._data.dbi.periods).map(data => new Period(data));
		this.timetables = iterate(this._data.dp.dates).map(([i, date, data]) => new Timetable(data, date, this));

		//Create single values
		this.ASC = new ASC(this._data.ASC, this);
		this.year = this._data.dp.year;

		//Parse current user
		const id = (this._data.mygroups[0].match(/\d+/) || [])[0];
		const type = (this._data.mygroups[0].match(/[a-z]+/i) || [])[0] || "";
		const user = [...this.students, ...this.teachers].find(e => e.id == id);
		const _temp = this.user;

		//Assign properties to current user
		this.user = type.toLowerCase() == "student" ? new Student(user._data, this) : new Teacher(user._data, this);
		this.user.credentials = _temp.credentials;
		this.user.cookies = _temp.cookies;
		this.user.isLoggedIn = _temp.isLoggedIn;
		this.user.isLoggedIn = _temp.isLoggedIn;

		return this._data;
	}

	async getStudents() {
		return this.students;
	}

	async getTeachers() {
		return this.teachers;
	}

	/**
	 * @typedef {Object} APIOptions
	 * @prop {string|ENDPOINT} url
	 * @prop {Object<string, any>} [data={}]
	 * @prop {string} [method="POST"]
	 * @prop {boolean} [encodeBody=true]
	 * @prop {"json"|"text"} [type="json"]
	 * @prop {boolean} [autoLogin=true]
	 */

	/**
	 *
	 * @static
	 * @param {APIOptions} options
	 * @return {Promise<any>} 
	 * @memberof Edupage
	 */
	async api(options) {
		let {
			url,
			data = {},
			method = "POST",
			encodeBody = true,
			type = "json",
			autoLogin = true
		} = options;

		return new Promise((resolve, reject) => {
			const tryFetch = (tryCount = 0) => {
				debug(`[API] Trying to send request...`);

				const tryLogIn = async () => {
					debug(`[API] Logging in...`);
					await this.user.login().then(() => {
						tryFetch(++tryCount - 1);
					}).catch(err => {
						error(`[API] Failed to log in user:`, err);
						reject(err)
					});
				};

				//If there are too many tries, reject the promise
				if(tryCount > 1) {
					error(`[API] Request terminated due to mutiple failures`);
					return reject(new Error("Failed to send request multiple times"));
				}

				//User does not have origin assigned yet
				if(!this.user.origin && autoLogin) {
					debug(`[API] User is not logged in yet`);
					return tryLogIn();
				}

				//If url is APIEndpoint, convert it to url
				if(typeof url === "number") {
					debug(`[API] Translating API endpoint into URL...`);
					url = this.buildRequestUrl(url);
				}

				//Send request
				debug(`[API] Sending request to '${url}'...`);
				fetch(url, {
					"headers": {
						"accept": "application/json, text/javascript, */*; q=0.01",
						"content-type": "application/x-www-form-urlencoded; charset=UTF-8",
						"Cookie": this.user.cookies.toString(false),
						"x-requested-with": "XMLHttpRequest",
						"referrer": `https://${this.user.origin}.edupage.org/`
					},
					"body": method == "POST" ? (encodeBody ? this.getRequestBody(data) : JSON.stringify(data)) : undefined,
					"method": method,
				}).then(res => res.text()).catch(err => {
					//Network error
					error(`[API] Error while sending request:`, err);
					tryFetch(++tryCount);
				}).then(text => {
					if(!text) {
						error(`[API] Empty response body`);
						return tryFetch(++tryCount);
					}

					//Needs to log in
					if(text.includes("edubarLogin.php") && autoLogin) {
						//Try to log in
						debug(`[API] Server responded with login page`);
						tryLogIn();
					} else {
						if(type == "json") {
							try {
								//Parse response as json
								var json = JSON.parse(text);
								debug(`[API] Request successful`);
								resolve(json);
							} catch(err) {
								//Unknown error
								error(`[API] Failed to parse response as '${type}':`, err, text.slice(0, 200));
								tryFetch(++tryCount);
							}
						} else if(type == "text") {
							//Already as text, do not have to parse
							debug(`[API] Request successful`);
							resolve(text);
						} else {
							//Unknown response type
							error(`[API] Invalid response type provided ('${type}')`);
							throw new TypeError(`Invalid response type '${type}'. (Available: 'json', 'text')`);
						}
					}
				});
			};
			tryFetch();
		});
	}

	/**
	 * Converts Object to form body
	 * @private
	 * @param {Object<string, any>} data 
	 * @return {string} Form body 
	 */
	getRequestBody(data) {
		const query = new URLSearchParams(data).toString();
		return `eqap=${encodeURIComponent(btoa(query))}&eqaz=0`;
	}

	/**
	 * Returns endpoint URL
	 * @private
	 * @param {import("./enums").APIEndpoint} endpoint
	 * @return {string} Endpoint URL
	 */
	buildRequestUrl(endpoint) {
		if(!this.user.origin) throw new LoginError(`Failed to build URL: User is not logged in yet`);

		const base = `https://${this.user.origin}.edupage.org`;

		if(endpoint == ENDPOINT.TIMELINE) return `${base}/timeline/?jwid=jwd52d7615&module=todo&filterTab=messages&akcia=getData&eqav=1&maxEqav=7`;
		if(endpoint == ENDPOINT.TEST_DATA) return `${base}/elearning/?cmd=MaterialPlayer&akcia=getETestData&ts=${new Date().getTime()}`;
		if(endpoint == ENDPOINT.CARDS_DATA) return `${base}/elearning/?cmd=EtestCreator&akcia=getCardsData`;
		if(endpoint == ENDPOINT.DASHBOARD) return `${base}/user/?`;
		if(endpoint == ENDPOINT.ONLINE_LESSON_SIGN) return `${base}/dashboard/server/onlinelesson.js?__func=getOnlineLessonOpenUrl`;

		throw new TypeError(`Invalid API endpoint '${endpoint}'`);
	}

	/**
	 * Parses raw JSON data from html
	 * @private
	 * @param {string} html 
	 * @returns {Object<string, any>}
	 */
	static parse(html) {
		const match = (html.match(/\.userhome\((.+?)\);$/m) || "")[1];

		try {
			return JSON.parse(match);
		} catch(e) {
			if(match) error(`Failed to parse JSON from Edupage html`);
			else error(`Failed to parse Edupage html`);

			return {};
		}
	}
}

module.exports = Edupage;