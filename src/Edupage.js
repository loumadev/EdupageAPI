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
const {LoginError, EdupageError} = require("./exceptions");
const Timetable = require("./Timetable");
const Message = require("./Message");
const Plan = require("./Plan");

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
		 * @type {Message[]}
		 */
		this.timelineItems = [];

		/**
		 * @type {Message[]}
		 */
		this.timeline = [];

		/**
		 * @type {Plan[]}
		 */
		this.plans = [];


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
		this._data = {...this._data, ..._json};
		this.year = this._data.dp.year;

		//Parse ASC data
		const _asc = ASC.parse(_html);
		this._data = {...this._data, ASC: _asc};
		this.ASC = new ASC(this._data.ASC, this);

		//Load timeline data
		const _timeline = await this.api({url: ENDPOINT.TIMELINE, data: {datefrom: this.getYearStart(false)}});
		this._data = {...this._data, ..._timeline};

		//Load created timeline items
		const _created = await this.api({url: ENDPOINT.CREATED_TIMELINE_ITEMS, data: {odkedy: this.getYearStart()}});

		//Merge all timeline items together and filter them down
		this._data.timelineItems = [..._timeline.timelineItems, ..._created.data.items].filter((e, i, arr) =>
			//Remove duplicated items
			i == arr.findIndex(t => (
				t.timelineid == e.timelineid
			))
			//Remove useless items created only for notification to be sent
			&& !(e.typ == "sprava" && e.pomocny_zaznam && arr.some(t => t.timelineid == e.reakcia_na))
		);

		//Parse json and create Objects
		this.classes = Object.values(this._data.dbi.classes).map(data => new Class(data));
		this.classrooms = Object.values(this._data.dbi.classrooms).map(data => new Classroom(data, this));
		this.teachers = Object.values(this._data.dbi.teachers).map(data => new Teacher(data, this));
		this.parents = Object.values(this._data.dbi.parents).map(data => new Parent(data, this));
		this.students = Object.values(this._data.dbi.students).map(data => new Student(data, this));
		this.subjects = Object.values(this._data.dbi.subjects).map(data => new Subject(data));
		this.periods = Object.values(this._data.dbi.periods).map(data => new Period(data));
		this.plans = Object.values(this._data.dbi.plans).map(data => new Plan(data, this));
		this.timetables = iterate(this._data.dp.dates).map(([i, date, data]) => new Timetable(data, date, this));

		//Create Message objects for each timeline item
		this._data.timelineItems
			.sort((a, b) => new Date(a.cas_pridania).getTime() - new Date(b.cas_pridania).getTime())
			.forEach(data => this.timelineItems.unshift(new Message(data, this)));

		//Filter out confirmation messages
		this.timeline = this.timelineItems.filter(e => e.type != "confirmation");

		//Init objects if needed
		this.classes.forEach(e => e.init(this));

		//Parse current user
		const _temp = this.user;
		const id = (this._data.userid.match(/\d+/) || [])[0];
		const user = this.getUserById(id);

		//Error handling
		if(!user) throw new EdupageError(`Failed to load currently logged in user`);

		//Assign properties to current user
		this.user = User.from(this.ASC.loggedUser, user._data, this);
		this.user.credentials = _temp.credentials;
		this.user.cookies = _temp.cookies;
		this.user.isLoggedIn = _temp.isLoggedIn;
		this.user.email = this._data.userrow.p_mail;

		return this._data;
	}

	/**
	 *
	 * @param {string} id
	 * @return {User|Teacher|Student|Parent|undefined} 
	 * @memberof Edupage
	 */
	getUserById(id) {
		return [this.user, ...this.teachers, ...this.students, ...this.parents].find(e => e.id == id);
	}

	/**
	 *
	 * @param {string} userString
	 * @return {User|Teacher|Student|Parent|undefined} 
	 * @memberof Edupage
	 */
	getUserByUserString(userString) {
		const id = (userString.match(/-?\d+/) || "")[0];

		return this.getUserById(id);
	}

	/**
	 *
	 * @param {boolean} time
	 * @return {string} 
	 * @memberof Edupage
	 */
	getYearStart(time = true) {
		return `${this.year}-${this.ASC.schoolyearTurnover}${time ? " 00:00:00" : ""}`;
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

		if(endpoint == ENDPOINT.TIMELINE) return `${base}/timeline/?akcia=getData`;
		if(endpoint == ENDPOINT.TEST_DATA) return `${base}/elearning/?cmd=MaterialPlayer&akcia=getETestData&ts=${new Date().getTime()}`;
		if(endpoint == ENDPOINT.CARDS_DATA) return `${base}/elearning/?cmd=EtestCreator&akcia=getCardsData`;
		if(endpoint == ENDPOINT.DASHBOARD) return `${base}/user/?`;
		if(endpoint == ENDPOINT.ONLINE_LESSON_SIGN) return `${base}/dashboard/server/onlinelesson.js?__func=getOnlineLessonOpenUrl`;
		if(endpoint == ENDPOINT.MESSAGE_REPLIES) return `${base}/timeline/?akcia=getRepliesItem`;
		if(endpoint == ENDPOINT.CREATE_TIMELINE_ITEM) return `${base}/timeline/?akcia=createItem`;
		if(endpoint == ENDPOINT.CREATED_TIMELINE_ITEMS) return `${base}/timeline/?cmd=created&akcia=getData`;
		if(endpoint == ENDPOINT.CREATE_CONFIRMATION) return `${base}/timeline/?akcia=createConfirmation`;
		if(endpoint == ENDPOINT.HOMEWORK_FLAG) return `${base}/timeline/?akcia=homeworkFlag`;
		if(endpoint == ENDPOINT.CREATE_MESSAGE_REPLY) return `${base}/timeline/?akcia=createReply`;

		throw new TypeError(`Invalid API endpoint '${endpoint}'`);
	}

	/**
	 * Parses raw JSON data from html
	 * @private
	 * @param {string} html 
	 * @returns {import("../lib/RawData").RawDataObject}
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