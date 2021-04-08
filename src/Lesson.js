const RawData = require("../lib/RawData");
const Class = require("./Class");
const Classroom = require("./Classroom");
const Edupage = require("./Edupage");
const Period = require("./Period");
const Subject = require("./Subject");

class Lesson extends RawData {
	/**
	 * Creates an instance of Lesson.
	 * @param {Object<string, any>} [data={}]
	 * @param {Edupage} [edupage=null]
	 * @memberof Lesson
	 */
	constructor(data = {}, edupage = null) {
		super(data);

		/**
		 * Edupage instance
		 * @type {Edupage} 
		 */
		this.edupage = edupage;

		/**
		 * @type {string}
		 */
		this.id = data.lid;

		/**
		 * @type {string}
		 */
		this.periodid = data.period;

		/**
		 * @type {string}
		 */
		this.subjectid = data.subjectid;

		/**
		 * @type {string[]}
		 */
		this.classids = data.classids;

		/**
		 * @type {string[]}
		 */
		this.classroomids = data.classroomids;


		/**
		 * @type {Period}
		 */
		this.period = null;

		/**
		 * @type {Subject}
		 */
		this.subject = null;

		/**
		 * @type {Class[]}
		 */
		this.classes = [];

		/**
		 * @type {Classroom[]}
		 */
		this.classrooms = [];
	}
}

module.exports = Lesson;