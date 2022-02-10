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
     * @param {Date | number | string} date1
     * @param {Date | number | string} date2
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
     * Creates an instance of Edupage.
     * @memberof Edupage
     */
    constructor();
    /**
     * Instance of currently logged in user.
     * All the information in the edupage instance is related to this user.
     * This user is used to make all requests to the Edupage internal APIs.
     * @type {User | Teacher | Student}
     */
    user: User | Teacher | Student;
    /**
     * List of all seasons or semesters.
     * @type {Season[]}
     */
    seasons: Season[];
    /**
     * List of all students in the school (if the user is a teacher, otherwise the list contains classmates only).
     * @type {Student[]}
     */
    students: Student[];
    /**
     * List of all teachers in the school.
     * @type {Teacher[]}
     */
    teachers: Teacher[];
    /**
     * List of all classes in the school.
     * @type {Class[]}
     */
    classes: Class[];
    /**
     * List of all classrooms in the school.
     * @type {Classroom[]}
     */
    classrooms: Classroom[];
    /**
     * List of all parents for owned class (if the user is a teacher, otherwise the list contains parents of the student).
     * @type {Parent[]}
     */
    parents: Parent[];
    /**
     * List of all subjects in the school.
     * @type {Subject[]}
     */
    subjects: Subject[];
    /**
     * List of all periods in the school.
     * @type {Period[]}
     */
    periods: Period[];
    /**
     * List of all timetables currently fetched.
     * There are always timetables for 2 - 4 days (current + next, if friday + weekend).
     * This list is used as a cache to avoid fetching the same timetable multiple times.
     * @type {Timetable[]}
     */
    timetables: Timetable[];
    /**
     * List of all message items on the timeline for currently logged in user.
     * Contains visible messages as well as hidden confirmations and helper records
     * @type {Message[]}
     */
    timelineItems: Message[];
    /**
     * List of all visible timeline items on the timeline for currently logged in user.
     * @type {Message[]}
     */
    timeline: Message[];
    /**
     * List of all plans for currently logged in user.
     * @type {Plan[]}
     */
    plans: Plan[];
    /**
     * List of all assignments for currently logged in user.
     * @type {Assignment[]}
     */
    assignments: Assignment[];
    /**
     * List of all assignments type of homework for currently logged in user.
     * @type {Homework[]}
     */
    homeworks: Homework[];
    /**
     * List of all assignments type of test for currently logged in user.
     * @type {Test[]}
     */
    tests: Test[];
    /**
     * List of all applications in the school.
     * @experimental
     * @type {Application[]}
     */
    applications: Application[];
    /**
     * Instance of an ASC object.
     * Can be used to access some general school data.
     * @type {ASC}
     */
    ASC: ASC;
    /**
     * Current school year.
     * If the current school year is "2020/2021", then this value is `2020`.
     * @type {number}
     */
    year: number;
    /**
     * Base edupage URL.
     * @example "https://example.edupage.org"
     * @type {string}
     */
    baseUrl: string;
    /**
     * @typedef {import("./User").LoginOptions} LoginOptions
     */
    /**
     * Logs user in for this instance
     *
     * @param {string} [username=this.user.credentials.username] Username of the user
     * @param {string} [password=this.user.credentials.password] Password of the user
     * @param {LoginOptions} [options] Login options
     * @return {Promise<User | Teacher | Student>} Returns a promise that resolves with the `User` object if successful. If the 2FA is requested by the Edupage, the promise will resolve with `null`.
     * @memberof Edupage
     */
    login(username?: string, password?: string, options?: User.LoginOptions): Promise<User | Teacher | Student>;
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
    grades: Grade[];
    /**
     *
     * @param {string} id
     * @return {User | Teacher | Student | Parent | undefined}
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
     * @return {User | Teacher | Student | Parent | undefined}
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
     * @return {Promise<Timetable | undefined>}
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
     * @prop {string | ENDPOINT} url
     * @prop {Object<string, any> | stream.Readable | Buffer | string} [data={}]
     * @prop {Object<string, any>} [headers={}]
     * @prop {string} [method="POST"]
     * @prop {boolean} [encodeBody=true]
     * @prop {"json" | "text"} [type="json"]
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
        } | stream.Readable | Buffer | string;
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
    _sessionPingTimeout: NodeJS.Timeout;
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
import Grade = require("./Grade");
import Attachment = require("./Attachment");
import { ENDPOINT } from "./enums";
import stream = require("stream");
type RawDataObject = import("../lib/RawData").RawDataObject;
type APIEndpoint = import("./enums").APIEndpoint;
