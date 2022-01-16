const debug = require("debug")("edupage:log");
const error = require("debug")("edupage:error");
const fs = require("fs");
const stream = require("stream");
const {default: fetch} = require("node-fetch");
const Student = require("./Student");
const Teacher = require("./Teacher");
const User = require("./User");
const {btoa, iterate} = require("../lib/utils");
const {ENDPOINT, API_STATUS, TIMELINE_ITEM_TYPE} = require("./enums");
const Class = require("./Class");
const Classroom = require("./Classroom");
const Parent = require("./Parent");
const RawData = require("../lib/RawData");
const Subject = require("./Subject");
const Period = require("./Period");
const ASC = require("./ASC");
const {LoginError, EdupageError, AttachmentError, APIError, FatalError, ParseError} = require("./exceptions");
const Timetable = require("./Timetable");
const Message = require("./Message");
const Plan = require("./Plan");
const Attachment = require("./Attachment");
const Grade = require("./Grade");
const Season = require("./Season");
const Homework = require("./Homework");
const Assignment = require("./Assignment");
const Test = require("./Test");
const Application = require("./Application");

debug.log = console.log.bind(console);

/**
 * @typedef {import("../lib/RawData").RawDataObject} RawDataObject
 */

/**
 * @typedef {import("./enums").APIEndpoint} APIEndpoint
 */


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
		 * @type {Season[]}
		 */
		this.seasons = [];

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
		 * @type {Assignment[]}
		 */
		this.assignments = [];

		/**
		 * @type {Homework[]}
		 */
		this.homeworks = [];

		/**
		 * @type {Test[]}
		 */
		this.tests = [];

		/**
		 * @experimental
		 * @type {Application[]}
		 */
		this.applications = [];


		/**
		 * @type {ASC}
		 */
		this.ASC = null;

		/**
		 * @type {number}
		 */
		this.year = null;

		/**
		 * @type {string}
		 */
		this.baseUrl = null;
	}

	/**
	 * @typedef {import("./User").LoginOptions} LoginOptions
	 */

	/**
	 * Logs user in for this instance
	 *
	 * @param {string} [username=this.user.credentials.username] Username of the user
	 * @param {string} [password=this.user.credentials.password] Password of the user
	 * @param {LoginOptions} [options] Login options
	 * @return {Promise<User | Teacher | Student>} Returns a promise that resolves with the `User` object if successful. If the 2FA is requested by the Edupage, the promise will resolve with `null`. 
	 * @memberof Edupage
	 */
	async login(username = this.user.credentials.username, password = this.user.credentials.password, options) {
		return new Promise((resolve, reject) => {
			const temp = new User();
			temp.login(username, password, options).then(async user => {
				//Assign properties
				this.user = temp;
				this.baseUrl = `https://${this.user.origin}.edupage.org`;

				//Update edupage data
				await this.refresh().catch(reject);

				resolve(this.user);
			}).catch(reject);
		});
	}

	/**
	 * Refreshes all fields in `Edupage` instance
	 * @memberof Edupage
	 */
	async refresh() {
		//Refresh global Edupage data
		await this.refreshEdupage(false);

		//Refresh timeline data
		await this.refreshTimeline(false);

		//Refresh created timeline items
		await this.refreshCreatedItems(false);

		//Refresh grades
		await this.refreshGrades(false);

		//Update Edupage fields
		this._updateInternalValues();
	}

	/**
	 * Fetches global Edupage data (such as teachers, classes, classrooms, subjects...)
	 * and updates internal values.
	 * This includes ASC refresh.
	 * @param {boolean} [_update=true] Tells whether to update internal values or not.
	 * Can be tweaked if are calling multiple "refresh" methods at once, so you don't
	 * have to recalculate internal values every time and save some performance.
	 * @memberof Edupage
	 */
	async refreshEdupage(_update = true) {
		//Fetch data as HTML
		const _html = await this.api({
			url: ENDPOINT.DASHBOARD_GET_USER,
			method: "GET",
			type: "text"
		});
		const _json = Edupage.parse(_html);
		this._data = {...this._data, ..._json};
		this.year = this._data._edubar.autoYear || this._data._edubar.selectedYear;

		//Parse ASC data from fetched HTML
		const _asc = ASC.parse(_html);
		this._data = {...this._data, ASC: _asc};
		this.ASC = new ASC(this._data.ASC, this);

		if(_update) this._updateInternalValues();
	}

	/**
	 * Fetches timeline data (messages, notifications...)
	 * and updates internal values.
	 * @param {boolean} [_update=true] Tells whether to update internal values or not.
	 * Can be tweaked if are calling multiple "refresh" methods at once, so you don't
	 * have to recalculate internal values every time and save some performance.
	 * @memberof Edupage
	 */
	async refreshTimeline(_update = true) {

		//Fetch timeline data
		const _timeline = await this.api({
			url: ENDPOINT.TIMELINE_GET_DATA,
			data: {
				datefrom: this.getYearStart(false)
			}
		});

		//Add values to source object
		this._data = {...this._data, ..._timeline};

		if(_update) this._updateInternalValues();
	}

	/**
	 * Fetches timeline items data created by currently
	 * logged user and updates internal values.
	 * @param {boolean} [_update=true] Tells whether to update internal values or not.
	 * Can be tweaked if are calling multiple "refresh" methods at once, so you don't
	 * have to recalculate internal values every time and save some performance.
	 * @memberof Edupage
	 */
	async refreshCreatedItems(_update = true) {
		//Fetch created items data
		const _created = await this.api({
			url: ENDPOINT.TIMELINE_GET_CREATED_ITEMS,
			data: {
				odkedy: this.getYearStart()
			}
		});

		//Add values to source object
		this._data = {...this._data, _created};

		if(_update) this._updateInternalValues();
	}

	/**
	 * Fetches grades of currently logged
	 * user and updates internal values.
	 * @param {boolean} [_update=true] Tells whether to update internal values or not.
	 * Can be tweaked if are calling multiple "refresh" methods at once, so you don't
	 * have to recalculate internal values every time and save some performance.
	 * @memberof Edupage
	 */
	async refreshGrades(_update = true) {
		//Fetch created items data
		const _grades_html = await this.api({
			url: ENDPOINT.GRADES_DATA,
			method: "GET",
			type: "text"
		});

		//Parse values and add them to source object
		const _grades = Grade.parse(_grades_html);
		this._data = {...this._data, _grades};

		if(_update) this._updateInternalValues();
	}

	/**
	 * Internal method to update all the fields in Edupage instance.  Should be called
	 * after any of "refresh" methods (in case `_update` argument is set to `false`)
	 * @memberof Edupage
	 */
	_updateInternalValues() {
		//return;
		//Transform events Object into Array here rather than on each Grade iteration for better performance
		this._data._grades._events = {};
		iterate(this._data._grades.data?.vsetkyUdalosti || {})
			.forEach(([i, provider, object]) => this._data._grades._events[provider] = Object.values(object));

		//Merge all timeline items together and filter them down
		this._data.timelineItems = [...this._data.timelineItems, ...this._data._created.data.items].filter((e, i, arr) =>
			//Remove duplicated items
			i == arr.findIndex(t => (
				t.timelineid == e.timelineid
			))
			//Remove useless items created only for notification to be sent
			&& !(e.typ == TIMELINE_ITEM_TYPE.MESSAGE && e.pomocny_zaznam && arr.some(t => t.timelineid == e.reakcia_na))
		);

		//Reset values to prevent mutating the old ones
		this.timelineItems = [];
		this.assignments = [];
		this.homeworks = [];
		this.tests = [];

		//Parse json and create Objects
		this.seasons = Object.values(this._data._grades?.settings?.obdobia || {}).map(data => new Season(data));
		this.classes = Object.values(this._data.dbi?.classes || {}).map(data => new Class(data));
		this.classrooms = Object.values(this._data.dbi?.classrooms || {}).map(data => new Classroom(data, this));
		this.teachers = Object.values(this._data.dbi?.teachers || {}).map(data => new Teacher(data, this));
		this.parents = Object.values(this._data.dbi?.parents || {}).map(data => new Parent(data, this));
		this.students = Object.values(this._data.dbi?.students || {}).map(data => new Student(data, this));
		this.subjects = Object.values(this._data.dbi?.subjects || {}).map(data => new Subject(data));
		this.periods = Object.values(this._data.dbi?.periods || {}).map(data => new Period(data));
		this.plans = Object.values(this._data.dbi?.plans || {}).map(data => new Plan(data, this));
		this.timetables = iterate(this._data?.dp?.dates || {}).map(([i, date, data]) => new Timetable(data, date));
		this.grades = Object.values(this._data._grades?.data?.vsetkyZnamky || {}).map(data => new Grade(data, this));
		this.applications = Object.values(this._data.dbi?.process_types || {}).map(data => new Application(data, this));

		//Create assignments and add them to arrays
		this._data.homeworks.forEach(data => {
			const assignment = Assignment.from(data, this);

			if(assignment instanceof Homework) this.homeworks.push(assignment);
			if(assignment instanceof Test) this.tests.push(assignment);

			this.assignments.push(assignment);
		});

		//Create Message objects for each timeline item
		this._data.timelineItems
			.sort((a, b) => new Date(a.cas_pridania).getTime() - new Date(b.cas_pridania).getTime())
			.forEach(data => this.timelineItems.unshift(new Message(data, this)));

		//Filter out confirmation messages
		//TODO: filter out types prefixed with `h_`?
		this.timeline = this.timelineItems.filter(e => e.type != TIMELINE_ITEM_TYPE.CONFIRMATION);

		//Init objects if needed
		this.seasons.forEach(e => e.init(this));
		this.classes.forEach(e => e.init(this));
		this.timetables.forEach(e => e.init(this));

		//Parse current user
		const _temp = this.user;
		const user = this.getUserByUserString(this._data.userid);

		//Error handling
		if(!user) throw new EdupageError(`Failed to load currently logged in user`);

		//Assign properties to current user
		this.user = User.from(this.ASC.loggedUser, user._data, this);
		this.user.credentials = _temp.credentials;
		this.user.cookies = _temp.cookies;
		this.user.isLoggedIn = _temp.isLoggedIn;
		this.user.email = this._data.userrow.p_mail;
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
	 * @return {string} 
	 * @memberof Edupage
	 */
	getUserIdByUserString(userString) {
		return (userString.match(/-?\d+/) || "")[0];
	}

	/**
	 *
	 * @param {string} userString
	 * @return {User|Teacher|Student|Parent|undefined} 
	 * @memberof Edupage
	 */
	getUserByUserString(userString) {
		return this.getUserById(this.getUserIdByUserString(userString));
	}

	/**
	 *
	 * @param {boolean} time
	 * @return {string} 
	 * @memberof Edupage
	 */
	getYearStart(time = true) {
		return (this._data._edubar.year_turnover || `${this.year}-${this.ASC.schoolyearTurnover}`) + (time ? " 00:00:00" : "");
	}

	/**
	 *
	 * @param {Date} date
	 * @return {Promise<Timetable|undefined>} 
	 * @memberof Edupage
	 */
	async getTimetableForDate(date) {
		const timetable = this.timetables.find(e => Edupage.compareDay(e.date, date));

		if(timetable) return timetable;
		return (await this.fetchTimetablesForDates(date, date))[0];
	}

	/**
	 * @param {Date} fromDate
	 * @param {Date} toDate
	 * @return {Promise<Timetable[]>} 
	 * @memberof Edupage
	 */
	async fetchTimetablesForDates(fromDate, toDate) {
		//Get 'gpid' if it doesn't exist yet
		if(!this.ASC.gpid) {
			debug(`[Timetable] 'gpid' property does not exists, trying to fetch it...`);
			try {
				const _html = await this.api({url: ENDPOINT.DASHBOARD_GET_CLASSBOOK, method: "GET", type: "text"});
				const ids = [..._html.matchAll(/gpid="?(\d+)"?/gi)].map(e => e[1]);

				if(ids.length) this.ASC.gpid = ids[ids.length - 1];
				else throw new Error("Cannot find gpid value");
			} catch(err) {
				debug(`[Timetable] Could not get 'gpid' property`, err);
				throw new EdupageError("Could not get 'gpid' property: " + err.message);
			}
			debug(`[Timetable] 'gpid' property fetched!`);
		}

		//Load and parse data
		const _html = await this.api({
			url: ENDPOINT.DASHBOARD_GCALL,
			method: "POST",
			type: "text",
			data: new URLSearchParams({
				gpid: this.ASC.gpid,
				gsh: this.ASC.gsecHash,
				action: "loadData",
				datefrom: Edupage.dateToString(fromDate),
				dateto: Edupage.dateToString(toDate),
			}).toString(),
			encodeBody: false
		});
		const _json = Timetable.parse(_html);
		const timetables = iterate(_json.dates).map(([i, date, data]) => new Timetable(data, date, this));

		//Update timetables
		timetables.forEach(e => {
			const i = this.timetables.findIndex(t => e.date.getTime() == t.date.getTime());

			if(i > -1) this.timetables[i] = e;
			else this.timetables.push(e);
		});

		return timetables;
	}

	/**
	 * 
	 * @param {string} filepath 
	 * @returns {Promise<Attachment>}
	 */
	async uploadAttachment(filepath) {
		const CRLF = "\r\n";
		const filename = (filepath.match(/(?:.+[\\\/])*(.+\..+)$/m) || "")[1] || "untitled.txt";

		const buffer = Buffer.concat([
			Buffer.from("--" + Attachment.formBoundary + CRLF + `Content-Disposition: form-data; name="att"; filename="${filename}"` + CRLF + CRLF, "utf8"),
			await fs.promises.readFile(filepath).catch(err => {
				throw new AttachmentError(`Error while reading input file: ` + err.message, err);
			}),
			Buffer.from(CRLF + "--" + Attachment.formBoundary + "--" + CRLF, "utf8")
		]);

		const res = await this.api({
			url: ENDPOINT.TIMELINE_UPLOAD_ATTACHMENT,
			headers: {
				"content-type": `multipart/form-data; boundary=` + Attachment.formBoundary
			},
			data: buffer,
			encodeBody: false
		});

		if(res.status !== API_STATUS.OK) throw new APIError(`Failed to upload file: Invalid status received '${res.status}'`, res);

		return new Attachment(res.data, this);
	}

	/**
	 * @typedef {Object} APIOptions
	 * @prop {string|ENDPOINT} url
	 * @prop {Object<string, any>|stream.Readable|Buffer|string} [data={}]
	 * @prop {Object<string, any>} [headers={}]
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
		const {
			headers = {},
			data = {},
			method = "POST",
			encodeBody = true,
			type = "json",
			autoLogin = true
		} = options;

		let url = options.url;

		return new Promise((resolve, reject) => {
			const tryFetch = (tryCount = 0) => {
				debug(`[API] Trying to send request...`);

				const tryLogIn = async () => {
					debug(`[API] Logging in...`);
					await this.user.login(this.user.credentials.username, this.user.credentials.password)
						.then(() => {
							tryFetch(++tryCount - 1);
						}).catch(err => {
							error(`[API] Failed to log in user:`, err);
							reject(err);
						});
				};

				//If there are too many tries, reject the promise
				if(tryCount > 1) {
					error(`[API] Request terminated due to multiple failures`);
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
						"referrer": `https://${this.user.origin}.edupage.org/`,
						...headers
					},
					"body": "POST" == method ? (
						"string" == typeof data || data instanceof stream.Readable || data instanceof Buffer ? data : (
							encodeBody ? this.encodeRequestBody(data) : JSON.stringify(data)
						)
					) : undefined,
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
	 *
	 * @param {Date|number|string} date1
	 * @param {Date|number|string} date2
	 * @return {boolean} true if day of the dates is same, otherwise false
	 * @memberof Edupage
	 */
	static compareDay(date1, date2) {
		//Convert primitives to Date object
		if(typeof date1 === "number" || typeof date1 == "string") date1 = new Date(date1);
		if(typeof date2 === "number" || typeof date2 == "string") date2 = new Date(date2);

		return date1.getDate() == date2.getDate() &&
			date1.getMonth() == date2.getMonth() &&
			date1.getFullYear() == date2.getFullYear();
	}

	/**
	 *
	 * @param {Date} date
	 * @return {string} string representation of the date 
	 * @memberof Edupage
	 */
	static dateToString(date) {
		return date.toISOString().slice(0, 10);
	}

	/**
	 * Converts Object to form body
	 * @private
	 * @param {Object<string, any>} data 
	 * @return {string} Form body 
	 */
	encodeRequestBody(data) {
		const query = new URLSearchParams(data).toString();
		return `eqap=${encodeURIComponent(btoa(query))}&eqaz=0`;
	}

	/**
	 * Returns endpoint URL
	 * @private
	 * @param {APIEndpoint} endpoint
	 * @return {string} Endpoint URL
	 */
	buildRequestUrl(endpoint) {
		if(!this.user.origin) throw new LoginError(`Failed to build URL: User is not logged in yet`);

		let url = null;

		if(endpoint == ENDPOINT.DASHBOARD_GET_USER) url = `/user/?`;
		if(endpoint == ENDPOINT.DASHBOARD_GET_CLASSBOOK) url = `/dashboard/eb.php?barNoSkin=1`;
		if(endpoint == ENDPOINT.DASHBOARD_GCALL) url = `/gcall`;
		if(endpoint == ENDPOINT.DASHBOARD_SIGN_ONLINE_LESSON) url = `/dashboard/server/onlinelesson.js?__func=getOnlineLessonOpenUrl`;
		if(endpoint == ENDPOINT.TIMELINE_GET_DATA) url = `/timeline/?akcia=getData`;
		if(endpoint == ENDPOINT.TIMELINE_GET_REPLIES) url = `/timeline/?akcia=getRepliesItem`;
		if(endpoint == ENDPOINT.TIMELINE_GET_CREATED_ITEMS) url = `/timeline/?cmd=created&akcia=getData`;
		if(endpoint == ENDPOINT.TIMELINE_CREATE_ITEM) url = `/timeline/?akcia=createItem`;
		if(endpoint == ENDPOINT.TIMELINE_CREATE_CONFIRMATION) url = `/timeline/?akcia=createConfirmation`;
		if(endpoint == ENDPOINT.TIMELINE_CREATE_REPLY) url = `/timeline/?akcia=createReply`;
		if(endpoint == ENDPOINT.TIMELINE_FLAG_HOMEWORK) url = `/timeline/?akcia=homeworkFlag`;
		if(endpoint == ENDPOINT.TIMELINE_UPLOAD_ATTACHMENT) url = `/timeline/?akcia=uploadAtt`;
		if(endpoint == ENDPOINT.ELEARNING_TEST_DATA) url = `/elearning/?cmd=MaterialPlayer&akcia=getETestData&ts=${new Date().getTime()}`;
		if(endpoint == ENDPOINT.ELEARNING_TEST_RESULTS) url = `/elearning/?cmd=EtestCreator&akcia=getResultsData`;
		if(endpoint == ENDPOINT.ELEARNING_CARDS_DATA) url = `/elearning/?cmd=EtestCreator&akcia=getCardsData`;
		if(endpoint == ENDPOINT.GRADES_DATA) url = `/znamky/?barNoSkin=1`;

		if(!url) throw new TypeError(`Invalid API endpoint '${endpoint}'`);
		else return this.baseUrl + url;
	}

	/**
	 * Parses raw JSON data from html
	 * @private
	 * @param {string} html 
	 * @returns {RawDataObject}
	 */
	static parse(html) {
		let data = {
			_edubar: {}
		};

		const match = (html.match(/\.userhome\((.+?)\);$/m) || "")[1];
		if(!match) return FatalError.throw(new ParseError("Failed to parse Edupage data from html"), {html});

		try {
			data = {...JSON.parse(match)};
		} catch(e) {
			return FatalError.throw(new ParseError("Failed to parse JSON from Edupage html"), {html, match, e});
		}

		//Parse additional edubar data
		const match2 = (html.match(/edubar\(([\s\S]*?)\);/) || "")[1];
		if(!match2) return FatalError.throw(new ParseError("Failed to parse edubar data from html"), {html});

		try {
			data._edubar = JSON.parse(match2) || {};
		} catch(e) {
			return FatalError.throw(new ParseError("Failed to parse JSON from edubar html"), {html, match2, e});
		}

		return data;
	}
}

module.exports = Edupage;