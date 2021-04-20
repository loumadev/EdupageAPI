const RawData = require("../lib/RawData");
const Class = require("./Class");
const Edupage = require("./Edupage");
const Season = require("./Season");
const Student = require("./Student");
const Subject = require("./Subject");
const Teacher = require("./Teacher");

class Plan extends RawData {
	/**
	 * Creates an instance of Plan.
	 * @param {import("../lib/RawData").RawDataObject} [data={}]
	 * @param {Edupage} [edupage=null]
	 * @memberof Plan
	 */
	constructor(data = {}, edupage = null) {
		super(data);

		if(!data.settings) data.settings = {};
		if(typeof data.settings === "string") data.settings = JSON.parse(data.settings) || {};

		/**
		 * Edupage instance
		 * @type {Edupage} 
		 */
		this.edupage = edupage;


		/**
		 * @type {string}
		 */
		this.id = data.planid;

		/**
		 * @type {string}
		 */
		this.subjectId = data.predmetid;

		/**
		 * @type {string}
		 */
		this.customClassId = data.triedaid;;

		/**
		 * @type {string}
		 */
		this.customName = data.nazov;

		/**
		 * @type {Date}
		 */
		this.changedDate = data.cas_zmeny || data.lastChange ? new Date(data.cas_zmeny || data.lastChange) : null;

		/**
		 * @type {number}
		 */
		this.year = +data.rok;

		/**
		 * @type {Object<string, any>}
		 */
		this.settings = data.settings;

		/**
		 * @type {boolean}
		 */
		this.isPublic = !!+data.zverejnit_studentom;

		/**
		 * @type {string}
		 * @example "o"
		 */
		this.state = data.stav;

		/**
		 * @type {boolean}
		 */
		this.isValid = !!+data.valid;

		/**
		 * @type {Date}
		 */
		this.approvedDate = data.approved ? new Date(data.approved) : null;

		/**
		 * @type {boolean}
		 */
		this.isApproved = !!this.approvedDate;

		/**
		 * @type {string}
		 */
		this.otherId = data.ineid;

		/**
		 * @type {number}
		 */
		this.topicsCount = data.countTopics;

		/**
		 * @type {number}
		 */
		this.taughtCount = data.countTaught;

		/**
		 * @type {number}
		 */
		this.standardsCount = data.countStandards;

		/**
		 * @type {string}
		 */
		this.timetableGroup = data.rozvrhy_skupinaMeno || null;

		/**
		 * @type {Season}
		 */
		this.season = null;

		/**
		 * @type {string}
		 */
		this.name = data.nazovPlanu;

		/**
		 * @type {number}
		 */
		this.classOrdering = data.triedaOrdering;

		/**
		 * @type {boolean}
		 */
		this.isEntireClass = !!data.entireClass;


		/**
		 * @type {Subject}
		 */
		this.subject = null;

		/**
		 * @type {Class[]}
		 */
		this.classes = [];

		/**
		 * @type {Teacher}
		 */
		this.teacher = null;

		/**
		 * @type {Teacher[]}
		 */
		this.teachers = [];

		/**
		 * @type {Student[]}
		 */
		this.students = [];


		if(this.edupage) Plan.prototype.init.call(this);
	}

	/**
	 * 
	 * @param {Edupage} [edupage=null]
	 * @memberof Plan
	 */
	init(edupage = null) {
		if(edupage) this.edupage = edupage;

		if(this._data.obdobie) this.season = this.edupage.seasons.find(e => e.id == this._data.obdobie);

		this.subject = this.edupage.subjects.find(e => e.id == this._data.predmetid);
		this.teacher = this.edupage.teachers.find(e => e.id == this._data.ucitelid);

		this.classes = this._data.triedy.map(e => this.edupage.classes.find(t => t.id == e.toString()));
		this.teachers = this._data.ucitelids.map(e => this.edupage.teachers.find(t => t.id == e));
		this.students = this._data.students.map(e => this.edupage.students.find(t => t.id == e));
	}
}

module.exports = Plan;