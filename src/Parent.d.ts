export = Parent;
/**
 * @typedef {import("../lib/RawData").RawDataObject} RawDataObject
 */
declare class Parent extends User {
    /**
     * Creates an instance of Parent.
     * @param {RawDataObject} [data={}]
     * @param {Edupage} [edupage=null]
     * @memberof Parent
     */
    constructor(data?: RawDataObject, edupage?: Edupage);
}
declare namespace Parent {
    export { RawDataObject };
}
import User = require("./User");
type RawDataObject = {
    [x: string]: any;
};
import Edupage = require("./Edupage");
