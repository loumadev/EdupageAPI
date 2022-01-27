const debug = require("debug")("edupage:log");
const error = require("debug")("edupage:error");
const RawData = require("../lib/RawData");
const Edupage = require("./Edupage");
const Grade = require("./Grade");
const Period = require("./Period");
const Subject = require("./Subject");
const Teacher = require("./Teacher");
const User = require("./User");
const {ASSIGNMENT_TYPE, ASSIGNMENT_GROUP, ENDPOINT} = require("./enums");
const {EdupageError, APIError} = require("./exceptions");

debug.log = console.log.bind(console);

/**
 * @typedef {import("./Homework")} Homework
 */

/**
 * @typedef {import("./Test")} Test
 */

/**
 * @typedef {import("../lib/RawData").RawDataObject} RawDataObject
 */

class Assignment extends RawData {
	/**
	 * Creates an instance of Assignment.
	 * @param {RawDataObject} [data={}]
	 * @param {Edupage} [edupage=null]
	 * @memberof Assignment
	 */
	constructor(data = {}, edupage = null) {
		super(data);

		/**
		 * @type {Edupage}
		 */
		this.edupage = edupage;

		/**
		 * @type {string}
		 * @example "superid:16647"
		 */
		this.id = data.homeworkid;

		/**
		 * @type {string}
		 */
		this.superId = data.e_superid;

		/**
		 * @type {User | Teacher}
		 */
		this.owner = null;

		/**
		 * @type {Subject}
		 */
		this.subject = null;

		/**
		 * @type {string}
		 */
		this.title = data.name;

		/**
		 * @type {string}
		 */
		this.details = data.details;

		/**
		 * @type {Date}
		 */
		this.creationDate = new Date(data.datecreated || data.timestamp);

		/**
		 * @type {Date}
		 */
		this.fromDate = new Date(data.datetimefrom || data.datefrom);

		/**
		 * @type {Date}
		 */
		this.toDate = new Date(data.datetimeto || data.dateto);

		/**
		 * @type {number}
		 * Time to complete the assignment in seconds
		 */
		this.duration = Math.floor((this.toDate.getTime() - this.fromDate.getTime()) / 1000);

		/**
		 * @type {Period}
		 */
		this.period = null;

		/**
		 * @type {string}
		 */
		this.testId = data.testid;

		/**
		 * @type {ASSIGNMENT_TYPE}
		 */
		this.type = data.typ.split("|")[1] || data.typ;

		/**
		 * @type {string}
		 * @example "subid:4B1340557B68DE71"
		 */
		this.hwkid = data.hwkid;

		/**
		 * @type {number}
		 */
		this.cardsCount = data.etestCards;

		/**
		 * @type {number}
		 */
		this.answerCardsCount = data.etestAnswerCards;

		/**
		 * @type {string}
		 */
		this.state = data.stavhodnotenia;

		/**
		 * @type {boolean}
		 */
		this.isSeen = this.state != "new";

		/**
		 * @type {string}
		 */
		this.comment = data.komentarPridelenie || "";

		/**
		 * @type {string}
		 */
		this.result = data.vysledok;

		/**
		 * @type {boolean}
		 */
		this.isFinished = !!+data.skoncil;

		/**
		 * @type {Date}
		 */
		this.stateUpdatedDate = data.studentStav?.timestamp ? new Date(data.studentStav?.timestamp) : null;

		/**
		 * @type {User | Teacher}
		 */
		this.stateUpdatedBy = null;

		/**
		 * @type {Grade[]}
		 */
		this.grades = [];


		if(this.edupage) Assignment.prototype.init.call(this);
	}

	/**
	 * 
	 * @param {Edupage} [edupage=null]
	 * @memberof Assignment
	 */
	init(edupage = null) {
		if(edupage) this.edupage = edupage;

		this.owner = this.edupage.getUserByUserString(this._data.userid);
		this.subject = this.edupage.subjects.find(e => e.id == this._data.predmetid);

		if(this._data.period) this.period = this.edupage.periods.find(e => e.id == this._data.period);
		if(this._data.studentStav?.nastavil_userid) this.stateUpdatedBy = this.edupage.getUserByUserString(this._data.studentStav?.nastavil_userid);

		this.grades = this.edupage.grades.filter(e => this.superId == e.superId);
		this.grades.forEach(e => e.assignment = this);
	}

	/**
	 * Fetches results + material data for assignment
	 * Usually the structure is: `{resultsData: {...}, materialData: {...}, ...}`
	 * Fetched data are cached into `this._data._resultsData`
	 * @return {Promise<RawDataObject>} Non-parsed raw data object
	 * @memberof Assignment
	 */
	async getData() {
		if(!this.edupage) throw new EdupageError(`Message does not have assigned Edupage instance yet`);

		//Load data
		const res = await this.edupage.api({
			url: ENDPOINT.ELEARNING_TEST_RESULTS,
			data: {
				"superid": this.superId
			}
		});

		//Request failed
		if(!res.superid) {
			error(`[Reply] Received invalid status from the server '${res.status}'`);
			throw new APIError(`Failed to send message: Invalid status received '${res.status}'`, res);
		}

		//Cache data
		this._data._resultsData = res;

		return res;
	}

	/**
	 * Creates an instance of Homework or Test from homework data.
	 * @static
	 * @param {RawDataObject} [data={}]
	 * @param {Edupage} [edupage=null]
	 * @return {Assignment | Homework | Test}
	 * @memberof Assignment
	 */
	static from(data = {}, edupage = null) {
		const type = data.typ.split("|")[1] || data.typ;

		if(ASSIGNMENT_GROUP.HOMEWORK.includes(type)) return new (require("./Homework"))(data, edupage);
		if(
			ASSIGNMENT_GROUP.EXAM.includes(type) ||
			ASSIGNMENT_GROUP.TEST.includes(type)
		) return new (require("./Test"))(data, edupage);

		//Other types might be implemented later on
		return new Assignment(data, edupage);
	}
}

module.exports = Assignment;