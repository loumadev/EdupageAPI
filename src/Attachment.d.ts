export = Attachment;
/**
 * @typedef {import("../lib/RawData").RawDataObject} RawDataObject
 */
declare class Attachment extends RawData {
    /**
     * Creates an instance of Attachment.
     * @param {RawDataObject} [data={}]
     * @param {Edupage} [edupage=null]
     * @memberof Attachment
     */
    constructor(data?: RawDataObject, edupage?: Edupage);
    /**
     * Edupage instance
     * @type {Edupage}
     */
    edupage: Edupage;
    /**
     * @type {string}
     */
    name: string;
    /**
     * @type {string}
     */
    src: string;
    /**
     *
     * @param {Edupage} [edupage=null]
     * @memberof Attachment
     */
    init(edupage?: Edupage): void;
    toJSON(): {
        [x: number]: string;
    };
}
declare namespace Attachment {
    export { formBoundary, RawDataObject };
}
import RawData = require("../lib/RawData");
import Edupage = require("./Edupage");
type RawDataObject = {
    [x: string]: any;
};
declare var formBoundary: string;
