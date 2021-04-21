const RawData = require("../lib/RawData");
const Classroom = require("./Classroom");
const Edupage = require("./Edupage");
const Teacher = require("./Teacher");

class Class extends RawData {
	/**
	 * Creates an instance of Class.
	 * @param {import("../lib/RawData").RawDataObject} [data={}]
	 * @param {Edupage} [edupage=null]
	 * @memberof Class
	 */
	constructor(data = {}, edupage = null) {
		super(data);

		/**
		 * Edupage instance
		 * @type {Edupage} 
		 */
		this.edupage = edupage;


		/**
		 * @type {number}
		 */
		this.grade = +data.grade ?? null;

		/**
		 * @type {string}
		 */
		this.id = data.id;

		/**
		 * @type {string}
		 */
		this.name = data.name;

		/**
		 * @type {string}
		 */
		this.short = data.short;

		/**
		 * @type {Classroom}
		 */
		this.classroom = null;

		/**
		 * @type {Teacher}
		 */
		this.teacher = null;

		/**
		 * @type {Teacher}
		 */
		this.teacher2 = null;

		if(this.edupage) Class.prototype.init.call(this);
	}

	/**
	 * 
	 * @param {Edupage} [edupage=null]
	 * @memberof Class
	 */
	init(edupage = null) {
		if(edupage) this.edupage = edupage;

		this.classroom = this.edupage.classrooms.find(e => e.id == this._data.classroomid);
		this.teacher = this.edupage.teachers.find(e => e.id == this._data.teacherid);
		this.teacher2 = this.edupage.teachers.find(e => e.id == this._data.teacher2id);
	}
}

module.exports = Class;