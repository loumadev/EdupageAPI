export = Application;
/**
 * @typedef {import("../lib/RawData").RawDataObject} RawDataObject
 */
/**
 * @typedef {import("./enums").EntityType} EntityType
 */
/**
 * @experimental
 * @class Application
 * @extends {RawData}
 */
declare class Application extends RawData {
    /**
     * Creates an instance of Grade.
     * @param {RawDataObject} [data={}]
     * @param {Edupage} [edupage=null]
     * @memberof Grade
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
    dateFrom: Date;
    /**
     * @type {Date}
     */
    dateTo: Date;
    /**
     * @type {string}
     */
    name: string;
    /**
     * Contains array of parameter names to be provided to `Application.post(...)` call (e.g. date, price...)
     * @type {string[]}
     */
    parameters: string[];
    /**
     * @type {EntityType}
     */
    availableFor: EntityType;
    /**
     * @type {boolean}
     */
    isEnabled: boolean;
    /**
     * @type {boolean}
     */
    isTextOptional: boolean;
    /**
     * @type {boolean}
     */
    isAdvancedWorkflow: boolean;
    /**
     * @type {boolean}
     */
    isSimpleWorkflow: boolean;
    /**
     * Creates Application draft
     * @return {Promise<string>} draft id
     * @memberof Application
     */
    createDraft(): Promise<string>;
    /**
     * Posts the application with input parameters
     * @experimental
     * @param {RawDataObject} [parameters={}] Object of parameters from `Application.parameters`
     * @param {string} [draftId=null] Your custom created draft ID. If the paramater is not specified (or provided value is falsy), new draft is created internally.
     * @return {Promise<boolean>} `true` if the method was successful, otherwise `false`
     * @memberof Application
     */
    post(parameters?: RawDataObject, draftId?: string): Promise<boolean>;
    /**
     *
     * @param {Edupage} [edupage=null]
     * @memberof Application
     */
    init(edupage?: Edupage): void;
}
declare namespace Application {
    export { RawDataObject, EntityType };
}
import RawData = require("../lib/RawData");
import Edupage = require("./Edupage");
type EntityType = string;
type RawDataObject = {
    [x: string]: any;
};
