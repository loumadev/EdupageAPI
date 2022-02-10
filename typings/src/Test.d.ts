export = Test;
/**
 * @typedef {import("../lib/RawData").RawDataObject} RawDataObject
 */
declare class Test extends Assignment {
}
declare namespace Test {
    export { RawDataObject };
}
import Assignment = require("./Assignment");
type RawDataObject = import("../lib/RawData").RawDataObject;
