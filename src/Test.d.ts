export = Test;
/**
 * @typedef {import("../lib/RawData").RawDataObject} RawDataObject
 */
declare class Test extends Assignment {
    /**
     * Creates an instance of Test.
     * @param {RawDataObject} [data={}]
     * @param {Edupage} [edupage=null]
     * @memberof Test
     */
    constructor(data?: RawDataObject, edupage?: Edupage);
}
declare namespace Test {
    export { RawDataObject };
}
import Assignment = require("./Assignment");
type RawDataObject = {
    [x: string]: any;
};
import Edupage = require("./Edupage");
