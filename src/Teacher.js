const Classroom = require("./Classroom");
const Edupage = require("./Edupage");
const User = require("./User");

class Teacher extends User {
	/**
	 * Creates an instance of Teacher.
	 * @param {Object<string, any>} [data={}]
	 * @param {Edupage} [edupage=null]
	 * @memberof Teacher
	 */
	constructor(data = {}, edupage = null) {
		super(data, edupage);

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
		 * @type {number}
		 */
		this.cb_hidden = data.cb_hidden;

		/**
		 * @type {string}
		 */
		this.classroomid = data.classroomid;

		/**
		 * @type {string}
		 */
		this.short = data.short;


		/**
		 * @type {Classroom}
		 */
		this.classroom = data.classroom;

		if(this.edupage) Teacher.prototype.init.call(this);
	}

	/**
	 * 
	 * @param {Edupage} [edupage=null]
	 * @memberof Class
	 */
	init(edupage = null) {
		if(edupage) this.edupage = edupage;

		this.classroom = this.edupage.classrooms.find(e => e.id == this.classroomid);
	}
}

module.exports = Teacher;