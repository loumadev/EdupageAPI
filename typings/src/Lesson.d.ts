export = Lesson;
/**
 * @typedef {import("../lib/RawData").RawDataObject} RawDataObject
 */
declare class Lesson extends RawData {
    /**
     * Creates an instance of Lesson.
     * @param {RawDataObject} [data={}]
     * @param {Edupage} [edupage=null]
     * @memberof Lesson
     */
    constructor(data?: RawDataObject, edupage?: Edupage);
    /**
     * Edupage instance associated to this object
     * @type {Edupage}
     */
    edupage: Edupage;
    /**
     * @type {string}
     */
    id: string;
    /**
     * @type {string}
     */
    lid: string;
    /**
     * @type {Date}
     */
    date: Date;
    /**
     * @type {string}
     */
    homeworkNote: string;
    /**
     * @type {string}
     */
    absentNote: string;
    /**
     * @type {string}
     */
    curriculum: string;
    /**
     * @type {string}
     */
    onlineLessonURL: string;
    /**
     * @type {boolean}
     */
    isOnlineLesson: boolean;
    /**
     * @type {Period}
     */
    period: Period;
    /**
     * @type {Subject}
     */
    subject: Subject;
    /**
     * @type {Class[]}
     */
    classes: Class[];
    /**
     * @type {Classroom[]}
     */
    classrooms: Classroom[];
    /**
     * @type {Student[]}
     */
    students: Student[];
    /**
     * @type {Teacher[]}
     */
    teachers: Teacher[];
    /**
     * @type {Assignment[]}
     */
    assignments: Assignment[];
    /**
     *
     * @param {Edupage} [edupage=null]
     * @memberof Lesson
     * @returns {void}
     */
    init(edupage?: Edupage): void;
    /**
     *
     * @return {Promise<boolean>}
     * @memberof Lesson
     */
    signIntoLesson(): Promise<boolean>;
}
declare namespace Lesson {
    export { RawDataObject };
}
import RawData = require("../lib/RawData");
import Edupage = require("./Edupage");
import Period = require("./Period");
import Subject = require("./Subject");
import Class = require("./Class");
import Classroom = require("./Classroom");
import Student = require("./Student");
import Teacher = require("./Teacher");
import Assignment = require("./Assignment");
type RawDataObject = import("../lib/RawData").RawDataObject;
