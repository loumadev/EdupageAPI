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
     * @return {Assignment | Homework | Test}
     * @memberof Assignment
     */
    static from(data?: RawDataObject, edupage?: Edupage): Assignment | Homework | Test;
    /**
     * Creates an instance of Assignment.
     * @param {RawDataObject} [data={}] Initializes instance with raw data.
     * @param {Edupage} [edupage=null] Edupage instance to use.
     * @memberof Assignment
     */
    constructor(data?: RawDataObject, edupage?: Edupage);
    /**
     * Edupage instance associated to this object.
     * @type {Edupage}
     */
    edupage: Edupage;
    /**
     * Homework id of this assignment.
     * @type {string}
     * @example "superid:16647"
     */
    id: string;
    /**
     * Super assignment id.
     * @type {string}
     */
    superId: string;
    /**
     * Author of the assignment.
     * @type {User | Teacher}
     */
    owner: User | Teacher;
    /**
     * Subject associated to this assignment.
     * @type {Subject}
     */
    subject: Subject;
    /**
     * Title of the assignment.
     * @type {string}
     */
    title: string;
    /**
     * Description of the assignment.
     * @type {string}
     */
    details: string;
    /**
     * Date when the assignment was created.
     * @type {Date}
     */
    creationDate: Date;
    /**
     * Date from which the assignment is available for the students.
     * @type {Date}
     */
    fromDate: Date;
    /**
     * Date by which the assignment is available to students.
     * @type {Date}
     */
    toDate: Date;
    /**
     * Time to complete the assignment in seconds
     * @type {number}
     */
    duration: number;
    /**
     * Period when the assignment is available.
     * @type {Period}
     */
    period: Period;
    /**
     * Id of the test.
     * @type {string}
     */
    testId: string;
    /**
     * Type of the assignment.
     * @type {ASSIGNMENT_TYPE}
     */
    type: ASSIGNMENT_TYPE;
    /**
     * Homework id 2.
     * @type {string}
     * @example "subid:4B1340557B68DE71"
     */
    hwkid: string;
    /**
     * Number of cards in the material.
     * @type {number}
     */
    cardsCount: number;
    /**
     * Number of answer cards in the material.
     * @type {number}
     */
    answerCardsCount: number;
    /**
     * The evaluation state of the assignment.
     * @type {string}
     */
    state: string;
    /**
     * Flag indicating if the assignment is new.
     * @type {boolean}
     */
    isSeen: boolean;
    /**
     * Comment of the assignment.
     * @type {string}
     */
    comment: string;
    /**
     * Result of the assignment.
     * @type {string}
     */
    result: string;
    /**
     * Flag indicating if the assignment is finished.
     * @type {boolean}
     */
    isFinished: boolean;
    /**
     * Date when the assignment was last updated.
     * @type {Date}
     */
    stateUpdatedDate: Date;
    /**
     * User who last updated the assignment.
     * @type {User | Teacher}
     */
    stateUpdatedBy: User | Teacher;
    /**
     * List of grades associated to this assignment.
     * @type {Grade[]}
     */
    grades: Grade[];
    /**
     * Initializes the object.
     * @param {Edupage} [edupage=null] Edupage instance to use.
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
type RawDataObject = import("../lib/RawData").RawDataObject;
type Homework = import("./Homework");
type Test = import("./Test");
