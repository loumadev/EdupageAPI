const Classroom = require("./Classroom");
const Edupage = require("./Edupage");
const Teacher = require("./Teacher");

class Class {
	/**
	 * Creates an instance of Class.
	 * @param {Object<string, any>} [data={}]
	 * @param {Edupage} [edupage=null]
	 * @memberof Class
	 */
	constructor(data = {}, edupage = null) {
		/**
		 * Raw object data
		 * @type {Object<string, any>} 
		 */
		this._data = data;

		/**
		 * Edupage instance
		 * @type {Edupage} 
		 */
		this.edupage = edupage;

		/**
		 * @type {string}
		 */
		this.classroomid = data.classroomid;

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
		 * @type {string}
		 */
		this.teacherid = data.teacherid;

		/**
		 * @type {string}
		 */
		this.teacher2id = data.teacher2id;


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

		this.classroom = this.edupage.classrooms.find(e => e.id == this.classroomid);
		this.teacher = this.edupage.teachers.find(e => e.id == this.teacherid);
		this.teacher2 = this.edupage.teachers.find(e => e.id == this.teacher2id);
	}
}

module.exports = Class;