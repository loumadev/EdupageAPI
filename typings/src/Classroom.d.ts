export = Classroom;
/**
 * @typedef {import("../lib/RawData").RawDataObject} RawDataObject
 */
declare class Classroom extends RawData {
    /**
     * Creates an instance of Classroom.
     * @param {RawDataObject} [data={}] Raw data to initialize the instance with.
     * @param {Edupage} [edupage=null] Edupage instance to use.
     * @memberof Classroom
     */
    constructor(data?: RawDataObject, edupage?: Edupage);
    /**
     * Edupage instance associated to this object.
     * @type {Edupage}
     */
    edupage: Edupage;
    /**
     * Unknown property
     * @type {boolean}
     */
    cb_hidden: boolean;
    /**
     * Classroom id
     * @type {string}
     */
    id: string;
    /**
     * Classroom name
     * @type {string}
     */
    name: string;
    /**
     * Classroom short name
     * @type {string}
     */
    short: string;
    /**
     * Initializes instance.
     * @param {Edupage} [edupage=null] Edupage instance to use.
     * @memberof Classroom
     */
    init(edupage?: Edupage): void;
}
declare namespace Classroom {
    export { RawDataObject };
}
import RawData = require("../lib/RawData");
import Edupage = require("./Edupage");
type RawDataObject = import("../lib/RawData").RawDataObject;
