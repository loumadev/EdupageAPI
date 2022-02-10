export = Period;
/**
 * @typedef {import("../lib/RawData").RawDataObject} RawDataObject
 */
declare class Period extends RawData {
    /**
     * Creates new invalid Period
     * @static
     * @param {{id?: string?, name?: string, short?: string, startTime?: string, endTime?: string}} [data=null] Data to be used to create the Period (if there's any)
     * @return {Period} Created Period
     * @memberof Period
     */
    static getInvalid(data?: {
        id?: string | null;
        name?: string;
        short?: string;
        startTime?: string;
        endTime?: string;
    }): Period;
    /**
     * Period id
     * @type {string}
     */
    id: string;
    /**
     * Period name
    * @type {string}
    */
    name: string;
    /**
     * Period short name
     * @type {string}
     */
    short: string;
    /**
     * Period start time in format HH:MM
     * @type {string}
     */
    startTime: string;
    /**
     * Period end time in format HH:MM
     * @type {string}
     */
    endTime: string;
}
declare namespace Period {
    export { RawDataObject };
}
import RawData = require("../lib/RawData");
type RawDataObject = import("../lib/RawData").RawDataObject;
