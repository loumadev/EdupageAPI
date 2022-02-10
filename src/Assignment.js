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
	 * @param {RawDataObject} [data={}] Initializes instance with raw data.
	 * @param {Edupage} [edupage=null] Edupage instance to use.
	 * @memberof Assignment
	 */
	constructor(data = {}, edupage = null) {
		super(data);

		/**
		 * Edupage instance associated to this object.
		 * @type {Edupage}
		 */
		this.edupage = edupage;

		/**
		 * Homework id of this assignment.
		 * @type {string}
		 * @example "superid:16647"
		 */
		this.id = data.homeworkid;

		/**
		 * Super assignment id.
		 * @type {string}
		 */
		this.superId = data.e_superid;

		/**
		 * Author of the assignment.
		 * @type {User | Teacher}
		 */
		this.owner = null;

		/**
		 * Subject associated to this assignment.
		 * @type {Subject}
		 */
		this.subject = null;

		/**
		 * Title of the assignment.
		 * @type {string}
		 */
		this.title = data.name;

		/**
		 * Description of the assignment.
		 * @type {string}
		 */
		this.details = data.details;

		/**
		 * Date when the assignment was created.
		 * @type {Date}
		 */
		this.creationDate = new Date(data.datecreated || data.timestamp);

		/**
		 * Date from which the assignment is available for the students.
		 * @type {Date}
		 */
		this.fromDate = new Date(data.datetimefrom || data.datefrom);

		/**
		 * Date by which the assignment is available to students.
		 * @type {Date}
		 */
		this.toDate = new Date(data.datetimeto || data.dateto);

		/**
		 * Time to complete the assignment in seconds
		 * @type {number}
		 */
		this.duration = Math.floor((this.toDate.getTime() - this.fromDate.getTime()) / 1000);

		/**
		 * Period when the assignment is available.
		 * @type {Period}
		 */
		this.period = null;

		/**
		 * Id of the test.
		 * @type {string}
		 */
		this.testId = data.testid;

		/**
		 * Type of the assignment.
		 * @type {ASSIGNMENT_TYPE}
		 */
		this.type = data.typ.split("|")[1] || data.typ;

		/**
		 * Homework id 2.
		 * @type {string}
		 * @example "subid:4B1340557B68DE71"
		 */
		this.hwkid = data.hwkid;

		/**
		 * Number of cards in the material.
		 * @type {number}
		 */
		this.cardsCount = data.etestCards;

		/**
		 * Number of answer cards in the material.
		 * @type {number}
		 */
		this.answerCardsCount = data.etestAnswerCards;

		/**
		 * The evaluation state of the assignment.
		 * @type {string}
		 */
		this.state = data.stavhodnotenia;

		/**
		 * Flag indicating if the assignment is new.
		 * @type {boolean}
		 */
		this.isSeen = this.state != "new";

		/**
		 * Comment of the assignment.
		 * @type {string}
		 */
		this.comment = data.komentarPridelenie || "";

		/**
		 * Result of the assignment.
		 * @type {string}
		 */
		this.result = data.vysledok;

		/**
		 * Flag indicating if the assignment is finished.
		 * @type {boolean}
		 */
		this.isFinished = !!+data.skoncil;

		/**
		 * Date when the assignment was last updated.
		 * @type {Date}
		 */
		this.stateUpdatedDate = data.studentStav?.timestamp ? new Date(data.studentStav?.timestamp) : null;

		/**
		 * User who last updated the assignment.
		 * @type {User | Teacher}
		 */
		this.stateUpdatedBy = null;

		/**
		 * List of grades associated to this assignment.
		 * @type {Grade[]}
		 */
		this.grades = [];


		if(this.edupage) Assignment.prototype.init.call(this);
	}

	/**
	 * Initializes the object.
	 * @param {Edupage} [edupage=null] Edupage instance to use.
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