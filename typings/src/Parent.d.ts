export = Parent;
/**
 * @typedef {import("../lib/RawData").RawDataObject} RawDataObject
 */
declare class Parent extends User {
}
declare namespace Parent {
    export { RawDataObject };
}
import User = require("./User");
type RawDataObject = import("../lib/RawData").RawDataObject;
