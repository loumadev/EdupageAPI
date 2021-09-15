const debug = require("debug")("edupage:log");
const error = require("debug")("edupage:error");
const RawData = require("../lib/RawData");
const Edupage = require("./Edupage");
const {FatalError, ParseError} = require("./exceptions");
const Lesson = require("./Lesson");

debug.log = console.log.bind(console);

/**
 * @typedef {import("../lib/RawData").RawDataObject} RawDataObject
 */

class Timetable extends RawData {
	/**
	 * Creates an instance of Timetable.
	 * @param {RawDataObject} [data={}]
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
		 * @type {Date} 
		 */
		this.date = new Date(date);

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

	/**
	 *
	 * @static
	 * @param {string} html
	 * @return {RawDataObject} 
	 * @memberof Timetable
	 */
	static parse(html) {
		const match = html.match(/classbook\.fill\([\s\S]*?,\s?([\s\S]+?)(?:,\s?\[[\s\S]*?\])?\);/mi);

		if(!match || !match[1]) return FatalError.throw(new ParseError("Failed to parse timetable data from html"), {html, match});

		try {
			return JSON.parse(match[1]);
		} catch(e) {
			return FatalError.throw(new ParseError("Failed to parse JSON from timetable html"), {html, match});
		}
	}
}

module.exports = Timetable;