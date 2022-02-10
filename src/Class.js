const RawData = require("../lib/RawData");
const Classroom = require("./Classroom");
const Edupage = require("./Edupage");
const Teacher = require("./Teacher");

/**
 * @typedef {import("../lib/RawData").RawDataObject} RawDataObject
 */

class Class extends RawData {
	/**
	 * Creates an instance of Class.
	 * @param {RawDataObject} [data={}] Raw data to initialize the instance with.
	 * @param {Edupage} [edupage=null] Edupage instance to use.
	 * @memberof Class
	 */
	constructor(data = {}, edupage = null) {
		super(data);

		/**
		 * Edupage instance associated to this object
		 * @type {Edupage} 
		 */
		this.edupage = edupage;


		/**
		 * Grade of the class
		 * @type {number}
		 */
		this.grade = +data.grade ?? null;

		/**
		 * ID of the class
		 * @type {string}
		 */
		this.id = data.id;

		/**
		 * Name of the class
		 * @type {string}
		 */
		this.name = data.name;

		/**
		 * Short name of the class
		 * @type {string}
		 */
		this.short = data.short;

		/**
		 * Classroom associated to this class
		 * @type {Classroom}
		 */
		this.classroom = null;

		/**
		 * Teacher associated to this class
		 * @type {Teacher}
		 */
		this.teacher = null;

		/**
		 * Teacher 2 associated to this class
		 * @type {Teacher}
		 */
		this.teacher2 = null;

		if(this.edupage) Class.prototype.init.call(this);
	}

	/**
	 * Initializes instance.
	 * @param {Edupage} [edupage=null] Edupage instance to use.
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