export type RawDataObject = import("../lib/RawData").RawDataObject;
/**
 * @typedef {import("../lib/RawData").RawDataObject} RawDataObject
 */
export class LoginError extends Error {
    constructor(message: any);
}
export class ParseError extends Error {
    constructor(message: any);
}
export class EdupageError extends Error {
    constructor(message: any);
}
export class APIError extends Error {
    constructor(message: any, ...data: any[]);
    data: any[];
}
export class MessageError extends Error {
    constructor(message: any, ...data: any[]);
    data: any[];
}
export class AttachmentError extends Error {
    constructor(message: any, ...data: any[]);
    data: any[];
}
export class FatalError extends Error {
    static warningsEnabled: boolean;
    /**
     * @static
     * @param {Error} error
     * @param {RawDataObject} data
     * @returns {any}
     * @memberof FatalError
     */
    static throw(error: Error, data: RawDataObject): any;
    /**
     * @static
     * @param {Error} error
     * @param {RawDataObject} data
     * @returns {any}
     * @memberof FatalError
     */
    static warn(error: Error, data: RawDataObject): any;
}
