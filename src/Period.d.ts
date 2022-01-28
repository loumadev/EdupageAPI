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
     * Creates an instance of Period.
     * @param {RawDataObject} [data=null]
     * @memberof Period
     */
    constructor(data?: RawDataObject);
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
     * @type {string}
     */
    startTime: string;
    /**
     * @type {string}
     */
    endTime: string;
}
declare namespace Period {
    export { RawDataObject };
}
import RawData = require("../lib/RawData");
type RawDataObject = {
    [x: string]: any;
};
