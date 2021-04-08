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
		this.id = data.id;

		/**
		 * @type {string}
		 */
		this.idl = data.lid;

		/**
		 * @type {string}
		 */
		this.periodId = data.period;

		/**
		 * @type {string}
		 */
		this.subjectId = data.subjectid;

		/**
		 * @type {string[]}
		 */
		this.classIds = data.classids;

		/**
		 * @type {string[]}
		 */
		this.classroomIds = data.classroomids;

		/**
		 * @type {string}
		 */
		this.onlineLessonURL = data.ol_url;

		/**
		 * @type {boolean}
		 */
		this.isOnlineLesson = !!this.onlineLessonURL;


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