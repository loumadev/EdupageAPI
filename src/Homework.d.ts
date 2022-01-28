export = Homework;
/**
 * @typedef {import("../lib/RawData").RawDataObject} RawDataObject
 */
declare class Homework extends Assignment {
    /**
     * Creates an instance of Homework.
     * @param {RawDataObject} [data={}]
     * @param {Edupage} [edupage=null]
     * @memberof Homework
     */
    constructor(data?: RawDataObject, edupage?: Edupage);
}
declare namespace Homework {
    export { RawDataObject };
}
import Assignment = require("./Assignment");
type RawDataObject = {
    [x: string]: any;
};
import Edupage = require("./Edupage");
