export = Season;
/**
 * @typedef {import("../lib/RawData").RawDataObject} RawDataObject
 */
declare class Season extends RawData {
    /**
     * Creates an instance of Season.
     * @param {RawDataObject} [data={}]
     * @param {Edupage} [edupage=null]
     * @memberof Season
     */
    constructor(data?: RawDataObject, edupage?: Edupage);
    /**
     * @type {Edupage}
     */
    edupage: Edupage;
    /**
     * @type {string}
     */
    id: string;
    /**
     * @type {Date}
     */
    fromDate: Date;
    /**
     * @type {Date}
     */
    toDate: Date;
    /**
     * @type {string}
     */
    name: string;
    /**
     * @type {number}
     */
    halfYear: number;
    /**
     * @type {number}
     */
    index: number;
    /**
     * @type {Season}
     */
    supSeason: Season;
    /**
     * @type {string[]}
     */
    types: string[];
    /**
     * @type {Season}
     */
    classificationSeason: Season;
    /**
     * @type {boolean}
     */
    isClassification: boolean;
    /**
     *
     * @param {Edupage} [edupage=null]
     * @memberof Message
     */
    init(edupage?: Edupage): void;
}
declare namespace Season {
    export { RawDataObject };
}
import RawData = require("../lib/RawData");
import Edupage = require("./Edupage");
type RawDataObject = {
    [x: string]: any;
};
