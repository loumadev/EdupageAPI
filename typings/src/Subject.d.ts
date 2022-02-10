export = Subject;
declare class Subject extends RawData {
    constructor(data?: any);
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
}
import RawData = require("../lib/RawData");
