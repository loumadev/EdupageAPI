export = Grade;
/**
 * @typedef {import("../lib/RawData").RawDataObject} RawDataObject
 */
declare class Grade extends RawData {
    /**
     *
     * @static
     * @param {string} html
     * @return {{settings: RawDataObject, data: RawDataObject}}
     * @memberof Grade
     */
    static parse(html: string): {
        settings: RawDataObject;
        data: RawDataObject;
    };
    /**
     * Creates an instance of Grade.
     * @param {RawDataObject} [data={}]
     * @param {Edupage} [edupage=null]
     * @memberof Grade
     */
    constructor(data?: RawDataObject, edupage?: Edupage);
    /**
     * @type {Edupage}
     */
    edupage: Edupage;
    /**
     * @type {string}
     */
    value: string;
    /**
     * @type {Date}
     */
    creationDate: Date;
    /**
     * @type {Season}
     */
    season: Season;
    /**
     * @type {Date}
     */
    signedDate: Date;
    /**
     * @type {Date}
     */
    signedByParentDate: Date;
    /**
     * @type {boolean}
     */
    isSigned: boolean;
    /**
     * @type {Subject}
     */
    subject: Subject;
    /**
     * @type {string}
     */
    state: string;
    /**
     * @type {Student}
     */
    student: Student;
    /**
     * @type {Teacher}
     */
    teacher: Teacher;
    /**
     * @type {string}
     */
    id: string;
    /**
     * @type {string}
     */
    eventId: string;
    /**
     * @type {Class}
     */
    class: Class;
    /**
     * @type {Class[]}
     */
    classes: Class[];
    /**
     * @type {string}
     */
    title: string;
    /**
     * @type {string}
     */
    short: string;
    /**
     * @type {string}
     * @example "31.3.2021"
     */
    date: string;
    /**
     * @type {string}
     */
    type: string;
    /**
     * @type {number}
     */
    weight: number;
    /**
     * @type {number}
     */
    maxPoints: number;
    /**
     * @type {number}
     */
    points: number;
    /**
     * @type {number}
     */
    percentage: number;
    /**
     * @type {Plan}
     */
    plan: Plan;
    /**
     * @type {string}
     */
    average: string;
    /**
     * @type {string}
     */
    provider: string;
    /**
     * @type {string}
     */
    superId: string;
    /**
     * @type {boolean}
     */
    isClassified: boolean;
    /**
     * @type {Assignment}
     */
    assignment: Assignment;
    /**
     *
     * @param {Edupage} [edupage=null]
     * @returns {any}
     * @memberof Grade
     */
    init(edupage?: Edupage): any;
}
declare namespace Grade {
    export { RawDataObject };
}
import RawData = require("../lib/RawData");
import Edupage = require("./Edupage");
import Season = require("./Season");
import Subject = require("./Subject");
import Student = require("./Student");
import Teacher = require("./Teacher");
import Class = require("./Class");
import Plan = require("./Plan");
import Assignment = require("./Assignment");
type RawDataObject = import("../lib/RawData").RawDataObject;
