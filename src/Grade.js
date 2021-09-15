const debug = require("debug")("edupage:log");
const error = require("debug")("edupage:error");
const RawData = require("../lib/RawData");
const Class = require("./Class");
const Edupage = require("./Edupage");
const Assignment = require("./Assignment");
const Plan = require("./Plan");
const Season = require("./Season");
const Student = require("./Student");
const Subject = require("./Subject");
const Teacher = require("./Teacher");
const {FatalError, ParseError} = require("./exceptions");

debug.log = console.log.bind(console);

/**
 * @typedef {import("../lib/RawData").RawDataObject} RawDataObject
 */

class Grade extends RawData {
	/**
	 * Creates an instance of Grade.
	 * @param {RawDataObject} [data={}]
	 * @param {Edupage} [edupage=null]
	 * @memberof Grade
	 */
	constructor(data = {}, edupage = null) {
		super(data);

		/**
		 * @type {Edupage}
		 */
		this.edupage = edupage;

		/**
		 * @type {string}
		 */
		this.value = data.data;

		/**
		 * @type {Date}
		 */
		this.creationDate = data.datum ? new Date(data.datum) : null;

		/**
		 * @type {Season}
		 */
		this.season = null;

		/**
		 * @type {Date}
		 */
		this.signedDate = data.podpisane ? new Date(data.podpisane) : null;

		/**
		 * @type {Date}
		 */
		this.signedByParentDate = data.podpisane_rodic ? new Date(data.podpisane_rodic) : null;

		/**
		 * @type {boolean}
		 */
		this.isSigned = !!(this.signedDate || this.signedByParentDate);

		/**
		 * @type {Subject}
		 */
		this.subject = null;

		/**
		 * @type {string}
		 */
		this.state = data.stav;

		/**
		 * @type {Student}
		 */
		this.student = null;

		/**
		 * @type {Teacher}
		 */
		this.teacher = null;

		/**
		 * @type {string}
		 */
		this.id = data.znamkaid;

		/**
		 * @type {string}
		 */
		this.eventId = data.udalostid;

		/**
		 * @type {Class}
		 */
		this.class = null;

		/**
		 * @type {Class[]}
		 */
		this.classes = null;

		/**
		 * @type {string}
		 */
		this.title = "";

		/**
		 * @type {string}
		 */
		this.short = "";

		/**
		 * @type {string}
		 * @example "31.3.2021"
		 */
		this.date = null;

		/**
		 * @type {string}
		 */
		this.type = null;

		/**
		 * @type {number}
		 */
		this.weight = 1;

		/**
		 * @type {number}
		 */
		this.maxPoints = null;

		/**
		 * @type {number}
		 */
		this.points = null;

		/**
		 * @type {number}
		 */
		this.percentage = null;

		/**
		 * @type {Plan}
		 */
		this.plan = null;

		/**
		 * @type {string}
		 */

		this.average = null;

		/**
		 * @type {string}
		 */
		this.provider = data.provider;

		/**
		 * @type {string}
		 */
		this.superId = null;

		/**
		 * @type {boolean}
		 */
		this.isClassified = false;

		/**
		 * @type {Assignment}
		 */
		this.assignment = null;

		if(this.edupage) Grade.prototype.init.call(this);
	}

	/**
	 * 
	 * @param {Edupage} [edupage=null]
	 * @memberof Grade
	 */
	init(edupage = null) {
		if(edupage) this.edupage = edupage;

		//Assign general properties
		this.season = this.edupage.seasons.find(e => e.id == this._data.mesiac);
		this.subject = this.edupage.subjects.find(e => e.id == this._data.predmetid);
		this.student = this.edupage.students.find(e => e.id == this._data.studentid);
		this.teacher = this.edupage.teachers.find(e => e.id == this._data.ucitelid);

		//Find event
		this._data._event = this.edupage._data._grades._events[this.provider].find(e => e.UdalostID == this.eventId);

		//Error handling in case event wasn't find 
		if(!this._data._event) {
			error(`[Grade] Cannot find event with ID '${this.eventId}'`);
			return;
		}

		//Assign event properties
		this.plan = this.edupage.plans.find(e => e.id == this._data._event.planid);
		this.class = this.edupage.classes.find(e => e.id == this._data._event.TriedaID);
		this.classes = this._data._event.Triedy.map(id => this.edupage.classes.find(e => e.id == id));
		this.title = this._data._event.p_meno;
		this.short = this._data._event.p_skratka;
		this.date = this._data._event.p_termin;
		this.type = this._data._event.p_typ_udalosti;
		this.weight = this._data._event.p_vaha ? +this._data._event.p_vaha / 20 : 1;
		this.average = this._data._event.priemer;

		//Find material assigned to Grade
		if(this._data._event.moredata?.elearning_superid) {
			this.superId = this._data._event.moredata.elearning_superid.toString();
			this.isClassified = true;
		}

		//Simple points calculations
		if(this.type == "3") {
			const max = parseFloat(this._data._event.p_vaha_body);
			const pts = parseFloat(this.value);

			//This is going to be invalid for fallback values but whatever ¯\_(ツ)_/¯
			this.maxPoints = isNaN(max) ? 100 : max;
			this.points = isNaN(pts) ? 100 : pts;
			this.percentage = this.points / this.maxPoints * 100;
		}
	}

	/**
	 *
	 * @static
	 * @param {string} html
	 * @return {{settings: RawDataObject, data: RawDataObject}} 
	 * @memberof Grade
	 */
	static parse(html) {
		const _settings = (html.match(/initZnamkovanieSettings\(([\s\S]*?)\);/) || "")[1];
		const _data = (html.match(/znamkyStudentViewer\(([\s\S]*?)\);/) || "")[1];

		let settings = {};
		let data = {};

		if(!_settings) return FatalError.throw(new ParseError("Failed to parse grade settings from html"), {html});
		if(!_data) return FatalError.throw(new ParseError("Failed to parse grade data from html"), {html});

		try {
			settings = JSON.parse(_settings);
		} catch(e) {
			return FatalError.throw(new ParseError("Failed to parse grade settings as JSON"), {html, _settings});
		}

		try {
			data = JSON.parse(_data);
		} catch(e) {
			return FatalError.throw(new ParseError("Failed to parse grade data as JSON"), {html, _data});
		}

		return {settings, data};
	}
}

module.exports = Grade;