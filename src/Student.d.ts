export = Student;
/**
 * @typedef {import("../lib/RawData").RawDataObject} RawDataObject
 */
declare class Student extends User {
    /**
     * Creates an instance of Student.
     * @param {RawDataObject} [data={}]
     * @param {Edupage} [edupage=null]
     * @memberof Student
     */
    constructor(data?: RawDataObject, edupage?: Edupage);
    /**
     * @type {number}
     */
    number: number;
    /**
     * @type {number}
     */
    numberInClass: number;
    /**
     * @type {string}
     */
    parent1Id: string;
    /**
     * @type {string}
     */
    parent2Id: string;
    /**
     * @type {string}
     */
    parent3Id: string;
    /**
     * @type {Parent}
     */
    parent1: Parent;
    /**
     * @type {Parent}
     */
    parent2: Parent;
    /**
     * @type {Parent}
     */
    parent3: Parent;
    /**
     * @type {Class}
     */
    class: Class;
}
declare namespace Student {
    export { RawDataObject };
}
import User = require("./User");
import Parent = require("./Parent");
import Class = require("./Class");
type RawDataObject = {
    [x: string]: any;
};
import Edupage = require("./Edupage");
