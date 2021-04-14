const RawData = require("../lib/RawData");
const Class = require("./Class");
const Classroom = require("./Classroom");
const Edupage = require("./Edupage");
const {ENDPOINT} = require("./enums");
const Period = require("./Period");
const Student = require("./Student");
const Subject = require("./Subject");
const Teacher = require("./Teacher");

class Lesson extends RawData {
	/**
	 * Creates an instance of Lesson.
	 * @param {import("../lib/RawData").RawDataObject} [data={}]
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
		this.id = data.flags.dp0.id;

		/**
		 * @type {string}
		 */
		this.lid = data.flags.dp0.lid;

		/**
		 * @type {Date}
		 */
		this.date = new Date(data.flags.dp0.date);

		/**
		 * @type {string}
		 */
		this.periodId = data.flags.dp0.period;

		/**
		 * @type {string}
		 */
		this.subjectId = data.flags.dp0.subjectid;

		/**
		 * @type {string[]}
		 */
		this.classIds = data.flags.dp0.classids;

		/**
		 * @type {string[]}
		 */
		this.classroomIds = data.flags.dp0.classroomids;

		/**
		 * @type {string[]}
		 */
		this.studentIds = data.flags.dp0.studentids;

		/**
		 * @type {string[]}
		 */
		this.teacherIds = data.flags.dp0.teacherids;

		/**
		 * @type {string[]}
		 */
		this.homeworkIds = data.flags.dp0.homeworkids;

		/**
		 * @type {string}
		 */
		this.homeworkNote = data.flags.dp0.note_homework || null;

		/**
		 * @type {string}
		 */
		this.absentNote = data.flags.dp0.note_student_absent || null;

		/**
		 * @type {string}
		 */
		this.curriculum = data.flags.dp0.note_wd || null;

		/**
		 * @type {string}
		 */
		this.onlineLessonURL = data.flags.dp0.ol_url || null;

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

		/**
		 * @type {Student[]}
		 */
		this.students = [];

		/**
		 * @type {Teacher[]}
		 */
		this.teachers = [];

		/**
		 * @type {any[]}
		 */
		this.homeworks = [];

		if(this.edupage) Lesson.prototype.init.call(this);
	}

	/**
	 * 
	 * @param {Edupage} [edupage=null]
	 * @memberof Lesson
	 */
	init(edupage = null) {
		if(edupage) this.edupage = edupage;

		this.period = this.edupage.periods.find(e => e.id == this.periodId);
		this.subject = this.edupage.subjects.find(e => e.id == this.subjectId);
		this.classes = this.classIds.map(id => this.edupage.classes.find(e => e.id == id));
		this.classrooms = this.classroomIds.map(id => this.edupage.classrooms.find(e => e.id == id));
		this.students = this.studentIds.map(id => this.edupage.students.find(e => e.id == id));
		this.teachers = this.teacherIds.map(id => this.edupage.teachers.find(e => e.id == id));
		//TODO: this.homeworks // "2021-04-07:01AC6375F9899C7BC2C0"
	}

	async signIntoLesson() {
		if(!this.isOnlineLesson) throw new Error(`Cannot sign into this lesson`);

		const payload = {
			"__args": [
				null,
				{
					"click": true,
					"date": this.date.toISOString().slice(0, 10),
					"ol_url": this.onlineLessonURL,
					"subjectid": this.subject.id
				}
			],
			"__gsh": this.edupage.ASC.gsecHash
		};

		const res = await this.edupage.api({
			url: ENDPOINT.ONLINE_LESSON_SIGN,
			data: payload,
			encodeBody: false
		});

		return res.reload != true;
	}
}

module.exports = Lesson;