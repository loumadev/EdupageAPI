const RawData = require("../lib/RawData");
const Edupage = require("./Edupage");
const Lesson = require("./Lesson");

class Timetable extends RawData {
	/**
	 * Creates an instance of Timetable.
	 * @param {Object<string, any>} [data={}]
	 * @param {string} [date=null]
	 * @param {Edupage} [edupage=null]
	 * @memberof Timetable
	 */
	constructor(data = {}, date = null, edupage = null) {
		super(data);

		/**
		 * Edupage instance
		 * @type {Edupage} 
		 */
		this.edupage = edupage;

		/**
		 * @type {string} 
		 */
		this.date = date;

		/**
		 * @type {Lesson[]} 
		 */
		this.lessons = [];


		/**
		 * @type {number} 
		 */
		this.week = data.tt_week;

		if(this.edupage) Timetable.prototype.init.call(this);
	}

	/**
	 * @param {Edupage} [edupage=null]
	 * @memberof Timetable
	 */
	init(edupage = null) {
		if(edupage) this.edupage = edupage;

		this.lessons = this._data.plan.filter(e => e.type == "lesson").map(data => new Lesson(data, this.edupage));
	}
}

module.exports = Timetable;