export = Timetable;
/**
 * @typedef {import("../lib/RawData").RawDataObject} RawDataObject
 */
declare class Timetable extends RawData {
    /**
     *
     * @static
     * @param {string} html
     * @return {RawDataObject}
     * @memberof Timetable
     */
    static parse(html: string): RawDataObject;
    /**
     * Creates an instance of Timetable.
     * @param {RawDataObject} [data={}]
     * @param {string} [date=null]
     * @param {Edupage} [edupage=null]
     * @memberof Timetable
     */
    constructor(data?: RawDataObject, date?: string, edupage?: Edupage);
    /**
     * Edupage instance associated to this object
     * @type {Edupage}
     */
    edupage: Edupage;
    /**
     * @type {Date}
     */
    date: Date;
    /**
     * @type {Lesson[]}
     */
    lessons: Lesson[];
    /**
     * @type {number}
     */
    week: number;
    /**
     * @param {Edupage} [edupage=null]
     * @memberof Timetable
     */
    init(edupage?: Edupage): void;
}
declare namespace Timetable {
    export { RawDataObject };
}
import RawData = require("../lib/RawData");
import Edupage = require("./Edupage");
import Lesson = require("./Lesson");
type RawDataObject = import("../lib/RawData").RawDataObject;
