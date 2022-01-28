export = ASC;
/**
 * @typedef {import("../lib/RawData").RawDataObject} RawDataObject
 */
declare class ASC extends RawData {
    /**
     *
     * @static
     * @param {string} html
     * @return {RawDataObject}
     * @memberof ASC
     */
    static parse(html: string): RawDataObject;
    /**
     * Creates an instance of ASC.
     * @param {RawDataObject} [data={}]
     * @param {Edupage} [edupage=null]
     * @memberof ASC
     */
    constructor(data?: RawDataObject, edupage?: Edupage);
    /**
     * @type {Edupage|string}
     */
    edupage: Edupage | string;
    /**
     * @type {string}
     */
    loggedUser: string;
    /**
     * @type {any[]}
     */
    loggedUserRights: any[];
    /**
     * @type {string}
     */
    timezone: string;
    /**
     * @type {number[]}
     */
    weekendDays: number[];
    /**
     * @type {string}
     */
    server: string;
    /**
     * @type {string}
     */
    schoolName: string;
    /**
     * @type {string}
     */
    lang: string;
    /**
     * @type {string}
     */
    schoolCountry: string;
    /**
     * @type {string}
     */
    schoolyearTurnover: string;
    /**
     * @type {string}
     */
    gsecHash: string;
    /**
     * @type {string}
     */
    gpid: string;
    /**
     * @type {string[]}
     */
    gpids: string[];
    /**
     * @type {number}
     */
    firstDayOfWeek: number;
}
declare namespace ASC {
    export { RawDataObject };
}
import RawData = require("../lib/RawData");
import Edupage = require("./Edupage");
type RawDataObject = {
    [x: string]: any;
};
