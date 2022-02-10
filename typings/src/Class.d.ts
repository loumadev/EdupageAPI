export = Class;
/**
 * @typedef {import("../lib/RawData").RawDataObject} RawDataObject
 */
declare class Class extends RawData {
    /**
     * Creates an instance of Class.
     * @param {RawDataObject} [data={}] Raw data to initialize the instance with.
     * @param {Edupage} [edupage=null] Edupage instance to use.
     * @memberof Class
     */
    constructor(data?: RawDataObject, edupage?: Edupage);
    /**
     * Edupage instance associated to this object
     * @type {Edupage}
     */
    edupage: Edupage;
    /**
     * Grade of the class
     * @type {number}
     */
    grade: number;
    /**
     * ID of the class
     * @type {string}
     */
    id: string;
    /**
     * Name of the class
     * @type {string}
     */
    name: string;
    /**
     * Short name of the class
     * @type {string}
     */
    short: string;
    /**
     * Classroom associated to this class
     * @type {Classroom}
     */
    classroom: Classroom;
    /**
     * Teacher associated to this class
     * @type {Teacher}
     */
    teacher: Teacher;
    /**
     * Teacher 2 associated to this class
     * @type {Teacher}
     */
    teacher2: Teacher;
    /**
     * Initializes instance.
     * @param {Edupage} [edupage=null] Edupage instance to use.
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
type RawDataObject = import("../lib/RawData").RawDataObject;
