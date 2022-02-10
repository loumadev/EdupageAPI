export = Teacher;
declare class Teacher extends User {
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
