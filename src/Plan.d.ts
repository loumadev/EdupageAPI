export = Plan;
/**
 * @typedef {import("../lib/RawData").RawDataObject} RawDataObject
 */
declare class Plan extends RawData {
    /**
     * Creates an instance of Plan.
     * @param {RawDataObject} [data={}]
     * @param {Edupage} [edupage=null]
     * @memberof Plan
     */
    constructor(data?: RawDataObject, edupage?: Edupage);
    /**
     * Edupage instance
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
    subjectId: string;
    /**
     * @type {string}
     */
    customClassId: string;
    /**
     * @type {string}
     */
    customName: string;
    /**
     * @type {Date}
     */
    changedDate: Date;
    /**
     * @type {number}
     */
    year: number;
    /**
     * @type {Object<string, any>}
     */
    settings: {
        [x: string]: any;
    };
    /**
     * @type {boolean}
     */
    isPublic: boolean;
    /**
     * @type {string}
     * @example "o"
     */
    state: string;
    /**
     * @type {boolean}
     */
    isValid: boolean;
    /**
     * @type {Date}
     */
    approvedDate: Date;
    /**
     * @type {boolean}
     */
    isApproved: boolean;
    /**
     * @type {string}
     */
    otherId: string;
    /**
     * @type {number}
     */
    topicsCount: number;
    /**
     * @type {number}
     */
    taughtCount: number;
    /**
     * @type {number}
     */
    standardsCount: number;
    /**
     * @type {string}
     */
    timetableGroup: string;
    /**
     * @type {Season}
     */
    season: Season;
    /**
     * @type {string}
     */
    name: string;
    /**
     * @type {number}
     */
    classOrdering: number;
    /**
     * @type {boolean}
     */
    isEntireClass: boolean;
    /**
     * @type {Subject}
     */
    subject: Subject;
    /**
     * @type {Class[]}
     */
    classes: Class[];
    /**
     * @type {Teacher}
     */
    teacher: Teacher;
    /**
     * @type {Teacher[]}
     */
    teachers: Teacher[];
    /**
     * @type {Student[]}
     */
    students: Student[];
    /**
     *
     * @param {Edupage} [edupage=null]
     * @memberof Plan
     */
    init(edupage?: Edupage): void;
}
declare namespace Plan {
    export { RawDataObject };
}
import RawData = require("../lib/RawData");
import Edupage = require("./Edupage");
import Season = require("./Season");
import Subject = require("./Subject");
import Class = require("./Class");
import Teacher = require("./Teacher");
import Student = require("./Student");
type RawDataObject = {
    [x: string]: any;
};
