/// <reference types="node" />
export = CookieJar;
declare class CookieJar {
    /**
     * Creates an instance of CookieJar.
     * @memberof CookieJar
     */
    constructor(...args: any[]);
    /**
     * @type {CookieJar.Cookie[]}
     */
    cookies: (typeof Cookie)[];
    /**
     * Adds cookie to the Jar
     * @param {string | CookieJar.Cookie | http.ServerResponse | http.IncomingMessage | fetch.Response} cookie Cookie name (requires second parameter), Cookie String, CookieJar.Cookie object, ServerResponseLike object
     * @param {string} [value=undefined]
     * @param {Object<string, any>} [options={}]
     * @return {CookieJar}
     * @memberof CookieJar
     */
    setCookie(cookie: string | typeof Cookie | http.ServerResponse | http.IncomingMessage | fetch.Response, value?: string, options?: {
        [x: string]: any;
    }): CookieJar;
    /**
     * Retrns cookie object found by name
     * @param {string} name Cookie name
     * @return {CookieJar.Cookie} Cookie object if found, otherwise undefined
     * @memberof CookieJar
     */
    getCookie(name: string): typeof Cookie;
    /**
     * Removes cookie from the Jar
     * @param {string | CookieJar.Cookie} cookie
     * @return {CookieJar.Cookie} Deleted cookie
     * @memberof CookieJar
     */
    deleteCookie(cookie: string | typeof Cookie): typeof Cookie;
    /**
     * Sends header with cookies
     * @param {http.ServerResponse} response Server response object
     * @param {boolean} [full=true] Include cookie properties and flags
     * @return {CookieJar}
     * @memberof CookieJar
     */
    sendCookies(response: http.ServerResponse, full?: boolean): CookieJar;
    /**
     * Converts Cookie object to cookie string
     * @param {boolean} [full=true] Include cookie properties and flags
     * @return {string} Cookie String
     * @memberof CookieJar
     */
    toString(full?: boolean): string;
    /**
     * Checks if the Jar is empty
     * @return {boolean} true if Jar is empty, otherwise false
     * @memberof CookieJar
     */
    isEmpty(): boolean;
    /**
     * Checks if the Jar contains cookie with certain name
     * @param {string} name Cookie name
     * @return {boolean} true if Jar contians cookie with certain name, otherwise false
     * @memberof CookieJar
     */
    includes(name: string): boolean;
    /**
     * Adds cookies to the Jar
     * @param {CookieJar.Cookie[]} cookies
     * @memberof CookieJar
     */
    _addCookiesToJar(...cookies: (typeof Cookie)[]): void;
    /**
     * Removes expired cookies from the Jar
     * @memberof CookieJar
     */
    _removeExpiredCookies(): void;
}
declare namespace CookieJar {
    export { Cookie };
}
declare class Cookie {
    static keywords: string[];
    static formatKeyword(key: any): string | false;
    static parse(cookieStringArray: any): any;
    name: string;
    value: string;
    /**
     * @type {CookieProperties}
     */
    props: {
        /**
         * The maximum lifetime of the cookie as an HTTP-date timestamp.
         */
        Expires?: string;
        /**
         * Number of seconds until the cookie expires. A zero or negative number will expire the cookie immediately.
         */
        "Max-Age"?: string;
        /**
         * Host to which the cookie will be sent.
         */
        Domain?: string;
        /**
         * A path that must exist in the requested URL, or the browser won't send the `Cookie` header.
         */
        Path?: string;
        /**
         * Controls whether a cookie is sent with cross-origin requests, providing some protection against cross-site request forgery attacks (CSRF).
         */
        SameSite?: string;
    };
    /**
     * @type {Array<"Secure" | "HttpOnly">}
     */
    flags: Array<"Secure" | "HttpOnly">;
    /**
     * Convert cookie to cookie string
     * @override
     * @param {boolean} [full=true] Include cookie properties and flags
     * @return {string} Cookie String
     */
    override toString(full?: boolean): string;
}
import http = require("http");
