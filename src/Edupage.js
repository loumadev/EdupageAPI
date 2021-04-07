const {default: fetch} = require("node-fetch");
const Student = require("./Student");
const Teacher = require("./Teacher");
const User = require("./User");
const {btoa} = require("../lib/utils");
const {ENDPOINT} = require("./enums");
const Class = require("./Class");
const Classroom = require("./Classroom");
const Parent = require("./Parent");
const RawData = require("../lib/RawData");
const Subject = require("./Subject");

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
		//Load data
		this._data = await this._api(ENDPOINT.TIMELINE);

		//Parse json and create Objects
		this.students = Object.values(this._data.dbi.students).map(data => new Student(data, this));
		this.teachers = Object.values(this._data.dbi.teachers).map(data => new Teacher(data, this));
		this.classes = Object.values(this._data.dbi.classes).map(data => new Class(data, this));
		this.classrooms = Object.values(this._data.dbi.classrooms).map(data => new Classroom(data, this));
		this.parents = Object.values(this._data.dbi.parents).map(data => new Parent(data));
		this.subjects = Object.values(this._data.dbi.subjects).map(data => new Subject(data));

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

	async _api(url, data = {}, method = "POST") {
		return new Promise((resolve, reject) => {
			const tryFetch = (tryCount = 0) => {
				const tryLogIn = async () => {
					//Server.log(`[Edupage] [API] Logging in as ${user.username}...`);
					await this.login().then(() => {
						tryFetch(++tryCount - 1);
					}).catch(err => {
						//Server.warn(`[Edupage] [API] Failed to log in user:`, err, arguments);
						//reject(new Error("Failed to log in user: " + err.error.message));
						reject(err)
					});
				};

				//If there are too many tries, reject the promise
				if(tryCount > 1) return reject(new Error("Failed to send request multiple times"));

				//User does not have origin assigned yet
				if(!this.user.origin) return tryLogIn();

				//If url is APIEndpoint, convert it to url
				if(typeof url === "number") url = this._buildRequestUrl(url);

				//Send request
				console.log(`[Edupage] [API] Sending request...`);
				fetch(url, {
					"headers": {
						"accept": "application/json, text/javascript, */*; q=0.01",
						"content-type": "application/x-www-form-urlencoded; charset=UTF-8",
						"Cookie": this.user.cookies.toString(false),
						"x-requested-with": "XMLHttpRequest",
						"referrer": `https://${this.user.origin}.edupage.org/`
					},
					"body": method == "POST" ? this._getRequestBody(data) : undefined,
					"method": method,
				}).then(res => res.text()).catch(e => {
					//Network error
					console.log(e, arguments);
					//Server.warn(`[Edupage] [API] Error while sending request`, arguments);
					tryFetch(++tryCount);
				}).then(text => {
					if(!text) return tryFetch(++tryCount);

					try {
						//Parse response as json
						var json = JSON.parse(text);
						resolve(json);
					} catch(err) {
						//Needs to log in
						if(text.includes("edubarLogin.php")) {
							//Try to log in
							tryLogIn();
						} else {
							//Unknown error
							//Server.warn(`[Edupage] [API] Failed to parse response:`, err, arguments, text?.slice(0, 200));
							tryFetch(++tryCount);
						}
					}
				});
			};
			tryFetch();
		});
	}

	/**
	 * Converts Object to form body
	 * @param {Object<string, any>} data 
	 * @return {string} Form body 
	 */
	_getRequestBody(data) {
		const query = new URLSearchParams(data).toString();
		return `eqap=${encodeURIComponent(btoa(query))}&eqaz=0`;
	}

	/**
	 * Returns endpoint URL
	 * @param {import("./enums").APIEndpoint} endpoint
	 * @return {string} Endpoint URL
	 */
	_buildRequestUrl(endpoint) {
		const base = `https://${this.user.origin}.edupage.org`;

		if(endpoint == ENDPOINT.TIMELINE) return `${base}/timeline/?jwid=jwd52d7615&module=todo&filterTab=messages&akcia=getData&eqav=1&maxEqav=7`;
		if(endpoint == ENDPOINT.TEST_DATA) return `${base}/elearning/?cmd=MaterialPlayer&akcia=getETestData&ts=${new Date().getTime()}`;
		if(endpoint == ENDPOINT.CARDS_DATA) return `${base}/elearning/?cmd=EtestCreator&akcia=getCardsData`;
	}
}

module.exports = Edupage;