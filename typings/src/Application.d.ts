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
     * Creates an instance of Application.
     * @param {RawDataObject} [data={}] Raw data to initialize the instance with.
     * @param {Edupage} [edupage=null] Edupage instance to use.
     * @memberof Application
     */
    constructor(data?: RawDataObject, edupage?: Edupage);
    /**
     * Edupage instance associated to this object.
     * @type {Edupage}
     */
    edupage: Edupage;
    /**
     * Id of the application.
     * @type {string}
     */
    id: string;
    /**
     * Date from which the application is valid.
     * @type {Date}
     */
    dateFrom: Date;
    /**
     * Date until which the application is valid.
     * @type {Date}
     */
    dateTo: Date;
    /**
     * Name of the application.
     * @type {string}
     */
    name: string;
    /**
     * Array of parameter names to be provided to `Application.post(...)` call (e.g. date, price...)
     * @type {string[]}
     */
    parameters: string[];
    /**
     * Type of entities this application is available for.
     * @type {EntityType}
     */
    availableFor: EntityType;
    /**
     * Flag indicating whether the application is enabled.
     * @type {boolean}
     */
    isEnabled: boolean;
    /**
     * Unknown property
     * @type {boolean}
     */
    isTextOptional: boolean;
    /**
     * Unknown property
     * @type {boolean}
     */
    isAdvancedWorkflow: boolean;
    /**
     * Unknown property
     * @type {boolean}
     */
    isSimpleWorkflow: boolean;
    /**
     * Creates Application draft
     * @return {Promise<string>} Created draft id
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
     * Initializes instance.
     * @param {Edupage} [edupage=null] Edupage instance to use.
     * @memberof Application
     */
    init(edupage?: Edupage): void;
}
declare namespace Application {
    export { RawDataObject, EntityType };
}
import RawData = require("../lib/RawData");
import Edupage = require("./Edupage");
type EntityType = import("./enums").EntityType;
type RawDataObject = import("../lib/RawData").RawDataObject;
