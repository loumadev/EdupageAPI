export = Edupage;
/**
 * @typedef {import("../lib/RawData").RawDataObject} RawDataObject
 */
/**
 * @typedef {import("./enums").APIEndpoint} APIEndpoint
 */
declare class Edupage extends RawData {
    /**
     *
     * @param {Date|number|string} date1
     * @param {Date|number|string} date2
     * @return {boolean} true if day of the dates is same, otherwise false
     * @memberof Edupage
     */
    static compareDay(date1: Date | number | string, date2: Date | number | string): boolean;
    /**
     *
     * @param {Date} date
     * @return {string} string representation of the date
     * @memberof Edupage
     */
    static dateToString(date: Date): string;
    /**
     * Parses raw JSON data from html
     * @private
     * @param {string} html
     * @returns {RawDataObject}
     */
    private static parse;
    /**
     * @type {User|Teacher|Student}
     */
    user: User | Teacher | Student;
    /**
     * @type {Season[]}
     */
    seasons: Season[];
    /**
     * @type {Student[]}
     */
    students: Student[];
    /**
     * @type {Teacher[]}
     */
    teachers: Teacher[];
    /**
     * @type {Class[]}
     */
    classes: Class[];
    /**
     * @type {Classroom[]}
     */
    classrooms: Classroom[];
    /**
     * @type {Parent[]}
     */
    parents: Parent[];
    /**
     * @type {Subject[]}
     */
    subjects: Subject[];
    /**
     * @type {Period[]}
     */
    periods: Period[];
    /**
     * @type {Timetable[]}
     */
    timetables: Timetable[];
    /**
     * @type {Message[]}
     */
    timelineItems: Message[];
    /**
     * @type {Message[]}
     */
    timeline: Message[];
    /**
     * @type {Plan[]}
     */
    plans: Plan[];
    /**
     * @type {Assignment[]}
     */
    assignments: Assignment[];
    /**
     * @type {Homework[]}
     */
    homeworks: Homework[];
    /**
     * @type {Test[]}
     */
    tests: Test[];
    /**
     * @experimental
     * @type {Application[]}
     */
    applications: Application[];
    /**
     * @type {ASC}
     */
    ASC: ASC;
    /**
     * @type {number}
     */
    year: number;
    /**
     * @type {string}
     */
    baseUrl: string;
    /**
     * Logs user in for this instance
     *
     * @param {string} [username=this.user.credentials.username]
     * @param {string} [password=this.user.credentials.password]
     * @return {Promise<User|Teacher|Student>}
     * @memberof Edupage
     */
    login(username?: string, password?: string): Promise<User | Teacher | Student>;
    /**
     * Refreshes all fields in `Edupage` instance
     * @memberof Edupage
     */
    refresh(): Promise<void>;
    /**
     * Fetches global Edupage data (such as teachers, classes, classrooms, subjects...)
     * and updates internal values.
     * This includes ASC refresh.
     * @param {boolean} [_update=true] Tells whether to update internal values or not.
     * Can be tweaked if are calling multiple "refresh" methods at once, so you don't
     * have to recalculate internal values every time and save some performance.
     * @memberof Edupage
     */
    refreshEdupage(_update?: boolean): Promise<void>;
    /**
     * Fetches timeline data (messages, notifications...)
     * and updates internal values.
     * @param {boolean} [_update=true] Tells whether to update internal values or not.
     * Can be tweaked if are calling multiple "refresh" methods at once, so you don't
     * have to recalculate internal values every time and save some performance.
     * @memberof Edupage
     */
    refreshTimeline(_update?: boolean): Promise<void>;
    /**
     * Fetches timeline items data created by currently
     * logged user and updates internal values.
     * @param {boolean} [_update=true] Tells whether to update internal values or not.
     * Can be tweaked if are calling multiple "refresh" methods at once, so you don't
     * have to recalculate internal values every time and save some performance.
     * @memberof Edupage
     */
    refreshCreatedItems(_update?: boolean): Promise<void>;
    /**
     * Fetches grades of currently logged
     * user and updates internal values.
     * @param {boolean} [_update=true] Tells whether to update internal values or not.
     * Can be tweaked if are calling multiple "refresh" methods at once, so you don't
     * have to recalculate internal values every time and save some performance.
     * @memberof Edupage
     */
    refreshGrades(_update?: boolean): Promise<void>;
    /**
     * Internal method to update all the fields in Edupage instance.  Should be called
     * after any of "refresh" methods (in case `_update` argument is set to `false`)
     * @memberof Edupage
     */
    _updateInternalValues(): void;
    grades: any;
    /**
     *
     * @param {string} id
     * @return {User|Teacher|Student|Parent|undefined}
     * @memberof Edupage
     */
    getUserById(id: string): User | Teacher | Student | Parent | undefined;
    /**
     *
     * @param {string} userString
     * @return {string}
     * @memberof Edupage
     */
    getUserIdByUserString(userString: string): string;
    /**
     *
     * @param {string} userString
     * @return {User|Teacher|Student|Parent|undefined}
     * @memberof Edupage
     */
    getUserByUserString(userString: string): User | Teacher | Student | Parent | undefined;
    /**
     *
     * @param {boolean} time
     * @return {string}
     * @memberof Edupage
     */
    getYearStart(time?: boolean): string;
    /**
     *
     * @param {Date} date
     * @return {Promise<Timetable|undefined>}
     * @memberof Edupage
     */
    getTimetableForDate(date: Date): Promise<Timetable | undefined>;
    /**
     * @param {Date} fromDate
     * @param {Date} toDate
     * @return {Promise<Timetable[]>}
     * @memberof Edupage
     */
    fetchTimetablesForDates(fromDate: Date, toDate: Date): Promise<Timetable[]>;
    /**
     *
     * @param {string} filepath
     * @returns {Promise<Attachment>}
     */
    uploadAttachment(filepath: string): Promise<Attachment>;
    /**
     * @typedef {Object} APIOptions
     * @prop {string|ENDPOINT} url
     * @prop {Object<string, any>|stream.Readable|Buffer|string} [data={}]
     * @prop {Object<string, any>} [headers={}]
     * @prop {string} [method="POST"]
     * @prop {boolean} [encodeBody=true]
     * @prop {"json"|"text"} [type="json"]
     * @prop {boolean} [autoLogin=true]
     */
    /**
     *
     * @static
     * @param {APIOptions} options
     * @param {number} [_count=0]
     * @return {Promise<any, Error | {retry: true, count: number}>} Resolves: Response body, Rejects: Error or retry object in case of successful invalid gsecHash error resolution
     * @memberof Edupage
     */
    api(options: {
        url: string | ENDPOINT;
        data?: {
            [x: string]: any;
        } | any | any | string;
        headers?: {
            [x: string]: any;
        };
        method?: string;
        encodeBody?: boolean;
        type?: "json" | "text";
        autoLogin?: boolean;
    }, _count?: number): Promise<any, Error | {
        retry: true;
        count: number;
    }>;
    /**
     * Sends a session ping request
     * @returns {Promise<boolean>} Whether the ping was successful
     */
    pingSession(): Promise<boolean>;
    /**
     * Schedules a session ping request
     */
    scheduleSessionPing(): void;
    _sessionPingTimeout: number;
    /**
     * Stops internal timers to prevent process from hanging infinitely.
     */
    exit(): void;
    /**
     * Converts Object to form body
     * @private
     * @param {Object<string, any>} data
     * @return {string} Form body
     */
    private encodeRequestBody;
    /**
     * Returns endpoint URL
     * @private
     * @param {APIEndpoint} endpoint
     * @return {string} Endpoint URL
     */
    private buildRequestUrl;
}
declare namespace Edupage {
    export { RawDataObject, APIEndpoint };
}
import RawData = require("../lib/RawData");
import User = require("./User");
import Teacher = require("./Teacher");
import Student = require("./Student");
import Season = require("./Season");
import Class = require("./Class");
import Classroom = require("./Classroom");
import Parent = require("./Parent");
import Subject = require("./Subject");
import Period = require("./Period");
import Timetable = require("./Timetable");
import Message = require("./Message");
import Plan = require("./Plan");
import Assignment = require("./Assignment");
import Homework = require("./Homework");
import Test = require("./Test");
import Application = require("./Application");
import ASC = require("./ASC");
import Attachment = require("./Attachment");
import { ENDPOINT } from "./enums";
type RawDataObject = {
    [x: string]: any;
};
type APIEndpoint = number;
