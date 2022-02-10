export = ASC;
/**
 * @typedef {import("../lib/RawData").RawDataObject} RawDataObject
 */
declare class ASC extends RawData {
    /**
     * Parses the HTML page and returns raw ASC data.
     * @static
     * @param {string} html HTML page to parse.
     * @return {RawDataObject} Parsed data.
     * @memberof ASC
     */
    static parse(html: string): RawDataObject;
    /**
     * Creates an instance of ASC.
     * @param {RawDataObject} [data={}] Raw data to initialize the instance with.
     * @param {Edupage} [edupage=null] Edupage instance to use.
     * @memberof ASC
     */
    constructor(data?: RawDataObject, edupage?: Edupage);
    /**
     * Edupage instance associated to this object.
     * @type {Edupage | string}
     */
    edupage: Edupage | string;
    /**
     * Userstring of the currently logged in user.
     * @type {string}
     */
    loggedUser: string;
    /**
     * Rights of the currently logged in user.
     * @type {any[]}
     */
    loggedUserRights: any[];
    /**
     * Timezone for the school.
     * @type {string}
     */
    timezone: string;
    /**
     * Weekend days for the school.
     * @type {number[]}
     */
    weekendDays: number[];
    /**
     * Edupage server.
     * @type {string}
     * @example "edupage61"
     */
    server: string;
    /**
     * Full name of the school.
     * @type {string}
     */
    schoolName: string;
    /**
     * Language code of the currently logged in user.
     * @type {string}
     */
    lang: string;
    /**
     * Country code of the school.
     * @type {string}
     */
    schoolCountry: string;
    /**
     * Turnover of the school in format "MM-DD"
     * @type {string}
     * @example "08-01"
     */
    schoolyearTurnover: string;
    /**
     * Secure hash used for API calls
     * @type {string}
     * @example "94c3f4d3"
     */
    gsecHash: string;
    /**
     * Id used for API calls
     * @type {string}
     */
    gpid: string;
    /**
     * List of currently available gpid ids.
     * @type {string[]}
     */
    gpids: string[];
    /**
     * First day of the week (0 = Sunday, 1 = Monday, ...).
     * @type {number}
     */
    firstDayOfWeek: number;
}
declare namespace ASC {
    export { RawDataObject };
}
import RawData = require("../lib/RawData");
import Edupage = require("./Edupage");
type RawDataObject = import("../lib/RawData").RawDataObject;
