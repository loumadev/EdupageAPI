export = Classroom;
/**
 * @typedef {import("../lib/RawData").RawDataObject} RawDataObject
 */
declare class Classroom extends RawData {
    /**
     * Creates an instance of Classroom.
     * @param {RawDataObject} [data={}]
     * @param {Edupage} [edupage=null]
     * @memberof Classroom
     */
    constructor(data?: RawDataObject, edupage?: Edupage);
    /**
     * Edupage instance
     * @type {Edupage}
     */
    edupage: Edupage;
    /**
     * @type {boolean}
     */
    cb_hidden: boolean;
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
     *
     * @param {Edupage} [edupage=null]
     * @memberof Classroom
     */
    init(edupage?: Edupage): void;
}
declare namespace Classroom {
    export { RawDataObject };
}
import RawData = require("../lib/RawData");
import Edupage = require("./Edupage");
type RawDataObject = {
    [x: string]: any;
};
