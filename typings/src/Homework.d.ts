export = Homework;
/**
 * @typedef {import("../lib/RawData").RawDataObject} RawDataObject
 */
declare class Homework extends Assignment {
}
declare namespace Homework {
    export { RawDataObject };
}
import Assignment = require("./Assignment");
type RawDataObject = import("../lib/RawData").RawDataObject;
