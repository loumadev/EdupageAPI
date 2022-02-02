export = Assignment;
/**
 * @typedef {import("./Homework")} Homework
 */
/**
 * @typedef {import("./Test")} Test
 */
/**
 * @typedef {import("../lib/RawData").RawDataObject} RawDataObject
 */
declare class Assignment extends RawData {
    /**
     * Creates an instance of Homework or Test from homework data.
     * @static
     * @param {RawDataObject} [data={}]
     * @param {Edupage} [edupage=null]
     * @return {Assignment|Homework|Test}
     * @memberof Assignment
     */
    static from(data?: RawDataObject, edupage?: Edupage): Assignment | Homework | Test;
    /**
     * Creates an instance of Assignment.
     * @param {RawDataObject} [data={}]
     * @param {Edupage} [edupage=null]
     * @memberof Assignment
     */
    constructor(data?: RawDataObject, edupage?: Edupage);
    /**
     * @type {Edupage}
     */
    edupage: Edupage;
    /**
     * @type {string}
     * @example "superid:16647"
     */
    id: string;
    /**
     * @type {string}
     */
    superId: string;
    /**
     * @type {User|Teacher}
     */
    owner: User | Teacher;
    /**
     * @type {Subject}
     */
    subject: Subject;
    /**
     * @type {string}
     */
    title: string;
    /**
     * @type {string}
     */
    details: string;
    /**
     * @type {Date}
     */
    creationDate: Date;
    /**
     * @type {Date}
     */
    fromDate: Date;
    /**
     * @type {Date}
     */
    toDate: Date;
    /**
     * @type {number}
     * Time to complete the assignment in seconds
     */
    duration: number;
    /**
     * @type {Period}
     */
    period: Period;
    /**
     * @type {string}
     */
    testId: string;
    /**
     * @type {ASSIGNMENT_TYPE}
     */
    type: ASSIGNMENT_TYPE;
    /**
     * @type {string}
     * @example "subid:4B1340557B68DE71"
     */
    hwkid: string;
    /**
     * @type {number}
     */
    cardsCount: number;
    /**
     * @type {number}
     */
    answerCardsCount: number;
    /**
     * @type {string}
     */
    state: string;
    /**
     * @type {boolean}
     */
    isSeen: boolean;
    /**
     * @type {string}
     */
    comment: string;
    /**
     * @type {string}
     */
    result: string;
    /**
     * @type {boolean}
     */
    isFinished: boolean;
    /**
     * @type {Date}
     */
    stateUpdatedDate: Date;
    /**
     * @type {User|Teacher}
     */
    stateUpdatedBy: User | Teacher;
    /**
     * @type {Grade[]}
     */
    grades: Grade[];
    /**
     *
     * @param {Edupage} [edupage=null]
     * @memberof Assignment
     */
    init(edupage?: Edupage): void;
    /**
     * Fetches results + material data for assignment
     * Usually the structure is: `{resultsData: {...}, materialData: {...}, ...}`
     * Fetched data are cached into `this._data._resultsData`
     * @return {Promise<RawDataObject>} Non-parsed raw data object
     * @memberof Assignment
     */
    getData(): Promise<RawDataObject>;
}
declare namespace Assignment {
    export { Homework, Test, RawDataObject };
}
import RawData = require("../lib/RawData");
import Edupage = require("./Edupage");
import User = require("./User");
import Teacher = require("./Teacher");
import Subject = require("./Subject");
import Period = require("./Period");
import { ASSIGNMENT_TYPE } from "./enums";
import Grade = require("./Grade");
type RawDataObject = {
    [x: string]: any;
};
type Homework = import("./Homework");
type Test = import("./Test");
