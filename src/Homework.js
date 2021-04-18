const debug = require("debug")("edupage:log");
const error = require("debug")("edupage:error");
const RawData = require("../lib/RawData");
const Class = require("./Class");
const Edupage = require("./Edupage");
const Parent = require("./Parent");
const Period = require("./Period");
const Session = require("./Session");
const Student = require("./Student");
const Subject = require("./Subject");
const Teacher = require("./Teacher");
const User = require("./User");

debug.log = console.log.bind(console);

/**
 * @typedef {import("../lib/RawData").RawDataObject} RawDataObject
 */

class Homework extends RawData {
	/**
	 * Creates an instance of Homework.
	 * @param {RawDataObject} [data={}]
	 * @param {Edupage} [edupage=null]
	 * @memberof Homework
	 */
	constructor(data = {}, edupage = null) {
		super(data);

		/**
		 * @type {Edupage}
		 * @example "superid:16647"
		 */
		this.edupage = edupage;

		/**
		 * @type {string}
		 */
		this.id = data.homeworkid;

		/**
		 * @type {string}
		 */
		this.superId = data.e_superid;

		/**
		 * @type {User|Teacher}
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
		 * @type {Period}
		 */
		this.period = null;

		/**
		 * @type {string}
		 */
		this.testId = data.testid;

		/**
		 * @type {string}
		 */
		this.type = data.typ;

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
		 * @type {User|Teacher}
		 */
		this.stateUpdatedBy = null;


		if(this.edupage) Homework.prototype.init.call(this);
	}

	/**
	 * 
	 * @param {Edupage} [edupage=null]
	 * @memberof Homework
	 */
	init(edupage = null) {
		if(edupage) this.edupage = edupage;

		this.owner = this.edupage.getUserByUserString(this._data.userid);
		this.subject = this.edupage.subjects.find(e => e.id == this._data.predmetid);

		if(this._data.period) this.period = this.edupage.periods.find(e => e.id == this._data.period);
		if(this._data.studentStav?.nastavil_userid) this.stateUpdatedBy = this.edupage.getUserByUserString(this._data.studentStav?.nastavil_userid);
	}
}

module.exports = Homework;