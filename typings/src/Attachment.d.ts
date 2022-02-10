export = Attachment;
/**
 * @typedef {import("../lib/RawData").RawDataObject} RawDataObject
 */
declare class Attachment extends RawData {
    /**
     * Creates an instance of Attachment.
     * @param {RawDataObject} [data={}] Raw data to initialize the instance with.
     * @param {Edupage} [edupage=null] Edupage instance to use.
     * @memberof Attachment
     */
    constructor(data?: RawDataObject, edupage?: Edupage);
    /**
     * Edupage instance associated to this object
     * @type {Edupage}
     */
    edupage: Edupage;
    /**
     * Name of the attachment file
     * @type {string}
     */
    name: string;
    /**
     * Absolute URL path to the attachment file uploaded on Edupage cloud server
     * @type {string}
     */
    src: string;
    /**
     * Initializes instance.
     * @param {Edupage} [edupage=null]
     * @memberof Attachment
     */
    init(edupage?: Edupage): void;
    /**
     * Converts the `Attachment` object to JSON object
     * @return {Object<string, string>} JSON object contianing the attachment name as key and the attachment URL as value
     * @memberof Attachment
     */
    toJSON(): {
        [x: string]: string;
    };
}
declare namespace Attachment {
    export { formBoundary, RawDataObject };
}
import RawData = require("../lib/RawData");
import Edupage = require("./Edupage");
type RawDataObject = import("../lib/RawData").RawDataObject;
declare var formBoundary: string;
