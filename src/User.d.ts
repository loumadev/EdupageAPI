export = User;
export = User;
/**
 * @typedef {import("../lib/RawData").RawDataObject} RawDataObject
 */
/**
 * @typedef {import("./Teacher")} Teacher
 */
/**
 * @typedef {import("./Student")} Student
 */
/**
 * @typedef {import("./Parent")} Parent
 */
/**
 * @typedef {import("./Message")} Message
 */
/**
 * @typedef {import("./enums").EntityType} EntityType
 */
declare class User extends RawData {
    /**
     * Creates an instance of Student or Teacher from user data.
     * @static
     * @param {string} userString
     * @param {RawDataObject} [data={}]
     * @param {Edupage} [edupage=null]
     * @return {User|Teacher|Student|Parent}
     * @memberof User
     */
    static from(userString: string, data?: RawDataObject, edupage?: Edupage): User | Teacher | Student | Parent;
    /**
     *
     * @static
     * @param {string} userString
     * @return {{id: string, type: EntityType, wildcard: boolean}}
     * @memberof User
     */
    static parseUserString(userString: string): {
        id: string;
        type: EntityType;
        wildcard: boolean;
    };
    /**
     * Creates an instance of User.
     * @param {RawDataObject} [data={}]
     * @param {Edupage} [edupage=null]
     * @memberof User
     */
    constructor(data?: RawDataObject, edupage?: Edupage);
    /**
     * Edupage instance
     * @type {Edupage}
     */
    edupage: Edupage;
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
    firstname: string;
    /**
     * @type {string}
     */
    lastname: string;
    /**
     * @type {GENDER}
     */
    gender: GENDER;
    /**
     * @type {string}
     */
    id: string;
    /**
     * @type {string}
     */
    userString: string;
    /**
     * @type {boolean}
     */
    isOut: boolean;
    /**
     * @type {string}
     */
    origin: string;
    /**
     * @type {{username: string, password: string}}
     */
    credentials: {
        username: string;
        password: string;
    };
    /**
     * @type {CookieJar}
     */
    cookies: CookieJar;
    /**
     * @type {boolean}
     */
    isLoggedIn: boolean;
    /**
     * @type {string}
     */
    email: string;
    /**
     *
     * @param {Edupage} [edupage=null]
     * @memberof Class
     */
    init(edupage?: Edupage): void;
    /**
     * @typedef {Object} MessageOptions
     * @prop {string} text
     * @prop {boolean} [important=false]
     * @prop {boolean} [parents=false]
     * @prop {Attachment[]} [attachments=[]]
     */
    /**
     *
     * @param {MessageOptions} options
     * @this {User|Teacher|Student|Parent}
     * @memberof User
     */
    sendMessage(options: {
        text: string;
        important?: boolean;
        parents?: boolean;
        attachments?: Attachment[];
    }): Promise<import("./Message")>;
    /**
     *
     * @param {string} username
     * @param {string} password
     * @return {Promise<User>}
     * @memberof User
     */
    login(username: string, password: string): Promise<User>;
    /**
     *
     * @return {string} UserString
     * @memberof User
     */
    getUserString(): string;
}
declare namespace User {
    export { RawDataObject, Teacher, Student, Parent, Message, EntityType };
}
import RawData = require("../lib/RawData");
import Edupage = require("./Edupage");
import { GENDER } from "./enums";
import CookieJar = require("../lib/CookieJar");
import Attachment = require("./Attachment");
type RawDataObject = {
    [x: string]: any;
};
type Teacher = import("./Teacher");
type Student = import("./Student");
type Parent = import("./Parent");
type EntityType = string;
type Message = import("./Message");
