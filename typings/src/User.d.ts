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
/**
 * @typedef {Object} LoginOptions
 * @prop {string | null | undefined} [code2FA=undefined] If the provided value is typeof `string`, it's considired as a 2FA code (should be provided after first unsuccessful login). If it's `null` the 2FA will be skipped. If omitted or `undefined` and the 2FA is requested by the Edupage, the function will resolve with `null`.
 * @prop {string} [user] Can be used to select a specific user in case there are more.
 * @prop {string} [edupage=""] The edupage subdomain (origin) to login to. Try to set this if you have trouble logging in (e.g. incorrect password error).
 */
declare class User extends RawData {
    /**
     * Creates an instance of Student or Teacher from user data.
     * @static
     * @param {string} userString Userstring to create an instance of
     * @param {RawDataObject} [data={}] Raw data to use for the instance
     * @param {Edupage} [edupage=null] Edupage instance to use for the instance
     * @return {User | Teacher | Student | Parent} User instance
     * @memberof User
     */
    static from(userString: string, data?: RawDataObject, edupage?: Edupage): User | Teacher | Student | Parent;
    /**
     * Parses the user string to provide some useful information
     * @static
     * @param {string} userString Userstring to parse
     * @return {{id: string, type: EntityType, wildcard: boolean}} Parsed userstring
     * @memberof User
     */
    static parseUserString(userString: string): {
        id: string;
        type: EntityType;
        wildcard: boolean;
    };
    /**
     * Creates an instance of User.
     * @param {RawDataObject} [data={}] Raw data to initialize the instance with.
     * @param {Edupage} [edupage=null] Edupage instance to use.
     * @memberof User
     */
    constructor(data?: RawDataObject, edupage?: Edupage);
    /**
     * Edupage instance associated to this object.
     * @type {Edupage}
     */
    edupage: Edupage;
    /**
     * Date since when the user is registered
     * @type {Date}
     */
    dateFrom: Date;
    /**
     * Date of expected leave of the user
     * @type {Date}
     */
    dateTo: Date;
    /**
     * Firstname of the user
     * @type {string}
     */
    firstname: string;
    /**
     * Lastname of the user
     * @type {string}
     */
    lastname: string;
    /**
     * Gender of the user
     * @type {GENDER}
     */
    gender: GENDER;
    /**
     * Edupage identifier of the user in format of number
     * @example "845796"
     * @type {string}
     */
    id: string;
    /**
     * Edupage userstring of the user
     * @example "Student845796"
     * @type {string}
     */
    userString: string;
    /**
     * Flag marking if the user has left the school
     * @type {boolean}
     */
    isOut: boolean;
    /**
     * Edupage origin of the user (subdomain)
     * @type {string}
     */
    origin: string;
    /**
     * Login credentials of the user. Set if the user is logged in or has attempted to log in.
     * @type {{username: string, password: string} | null}
     */
    credentials: {
        username: string;
        password: string;
    };
    /**
     * CookieJar object storing current session cookies for logged in user
     * @type {CookieJar}
     */
    cookies: CookieJar;
    /**
     * Flag telling if the user is logged in
     * @type {boolean}
     */
    isLoggedIn: boolean;
    /**
     * Email address of the logged in user
     * @type {string}
     */
    email: string;
    /**
     * Initializes instance with raw data
     * @param {Edupage} [edupage=null]
     * @memberof Class
     */
    init(edupage?: Edupage): void;
    /**
     * @typedef {Object} PollOption
     * @prop {string} text Text of the option.
     * @prop {string} [id] Id of the option. If not provided, a new one will be generated.
     */
    /**
     * @typedef {Object} PollOptions
     * @prop {PollOption[]} options Options to be added to the poll.
     * @prop {boolean} [multiple=false] If `true` multiple choices can be selected.
     */
    /**
     * @typedef {Object} MessageOptions
     * @prop {string} text Text of the message.
     * @prop {boolean} [important=false] If `true` the message will be marked as important. You will also be able to track who has read the message.
     * @prop {boolean} [parents=false] If `true` the message will be sent to student as well as their parents.
     * @prop {Attachment[]} [attachments=[]] Attachments to be added to the message.
     * @prop {PollOptions} [poll] Poll to be added to the message.
     */
    /**
     * Sends a message to the user
     * @param {MessageOptions} options Message options
     * @this {User | Teacher | Student | Parent}
     * @memberof User
     */
    sendMessage(options: {
        /**
         * Text of the message.
         */
        text: string;
        /**
         * If `true` the message will be marked as important. You will also be able to track who has read the message.
         */
        important?: boolean;
        /**
         * If `true` the message will be sent to student as well as their parents.
         */
        parents?: boolean;
        /**
         * Attachments to be added to the message.
         */
        attachments?: Attachment[];
        /**
         * Poll to be added to the message.
         */
        poll?: {
            /**
             * Options to be added to the poll.
             */
            options: {
                /**
                 * Text of the option.
                 */
                text: string;
                /**
                 * Id of the option. If not provided, a new one will be generated.
                 */
                id?: string;
            }[];
            /**
             * If `true` multiple choices can be selected.
             */
            multiple?: boolean;
        };
    }): Promise<import("./Message")>;
    /**
     * @typedef {import("../lib/ResponseTypings").MAuthResponse} MAuthResponse
     */
    /**
     * Logs in the user. Provide third parameter as login options if you have troubles logging in.
     * @param {string} username Username of the user
     * @param {string} password Password of the user
     * @param {LoginOptions} [options] Login options
     * @return {Promise<User | null>} Returns a promise that resolves with the `User` object if successful. If the 2FA is requested by the Edupage, the promise will resolve with `null`.
     * @memberof User
     */
    login(username: string, password: string, options?: LoginOptions): Promise<User | null>;
    /**
     * Retruns Edupage's representation of the user id.
     * @return {string} Userstring
     * @memberof User
     */
    getUserString(): string;
}
declare namespace User {
    export { RawDataObject, Teacher, Student, Parent, Message, EntityType, LoginOptions };
}
import RawData = require("../lib/RawData");
import Edupage = require("./Edupage");
import { GENDER } from "./enums";
import CookieJar = require("../lib/CookieJar");
import Attachment = require("./Attachment");
type LoginOptions = {
    /**
     * If the provided value is typeof `string`, it's considired as a 2FA code (should be provided after first unsuccessful login). If it's `null` the 2FA will be skipped. If omitted or `undefined` and the 2FA is requested by the Edupage, the function will resolve with `null`.
     */
    code2FA?: string | null | undefined;
    /**
     * Can be used to select a specific user in case there are more.
     */
    user?: string;
    /**
     * The edupage subdomain (origin) to login to. Try to set this if you have trouble logging in (e.g. incorrect password error).
     */
    edupage?: string;
};
type RawDataObject = import("../lib/RawData").RawDataObject;
type Teacher = import("./Teacher");
type Student = import("./Student");
type Parent = import("./Parent");
type EntityType = import("./enums").EntityType;
type Message = import("./Message");
