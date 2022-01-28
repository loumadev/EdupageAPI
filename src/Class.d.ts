export = Class;
/**
 * @typedef {import("../lib/RawData").RawDataObject} RawDataObject
 */
declare class Class extends RawData {
    /**
     * Creates an instance of Class.
     * @param {RawDataObject} [data={}]
     * @param {Edupage} [edupage=null]
     * @memberof Class
     */
    constructor(data?: RawDataObject, edupage?: Edupage);
    /**
     * Edupage instance
     * @type {Edupage}
     */
    edupage: Edupage;
    /**
     * @type {number}
     */
    grade: number;
    /**
     * @type {string}
     */
    id: string;
    /**
     * @type {string}
     */
    name: string;
    /**
     * @type {string}
     */
    short: string;
    /**
     * @type {Classroom}
     */
    classroom: Classroom;
    /**
     * @type {Teacher}
     */
    teacher: Teacher;
    /**
     * @type {Teacher}
     */
    teacher2: Teacher;
    /**
     *
     * @param {Edupage} [edupage=null]
     * @memberof Class
     */
    init(edupage?: Edupage): void;
}
declare namespace Class {
    export { RawDataObject };
}
import RawData = require("../lib/RawData");
import Edupage = require("./Edupage");
import Classroom = require("./Classroom");
import Teacher = require("./Teacher");
type RawDataObject = {
    [x: string]: any;
};
