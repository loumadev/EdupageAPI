export = Teacher;
declare class Teacher extends User {
    /**
     * Creates an instance of Teacher.
     * @param {Object<string, any>} [data={}]
     * @param {Edupage} [edupage=null]
     * @memberof Teacher
     */
    constructor(data?: {
        [x: string]: any;
    }, edupage?: Edupage);
    /**
     * @type {number}
     */
    cb_hidden: number;
    /**
     * @type {string}
     */
    short: string;
    /**
     * @type {Classroom}
     */
    classroom: Classroom;
}
import User = require("./User");
import Classroom = require("./Classroom");
import Edupage = require("./Edupage");
