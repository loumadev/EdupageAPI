import http from "http";
import fetch from "node-fetch";

export declare class RawData {
    constructor(_data: string | any = null);

    _data: any;
}

export type CookieProperties = {
    expires: string;
    maxAge: string;
    domain: string;
    path: string;
    sameSite: string;
}

export declare class Cookie {
    name: string;
    value: string;

    props: CookieProperties;
    flags: Array<"Secure" | "HttpOnly">

    static keywords = ["Expires", "Max-Age", "Domain", "Path", "Secure", "HttpOnly", "SameSite"];

	static formatKeyword(key: string): string | false;
    static parse(cookieStringArray: string[]): Cookie;

    toString(full: boolean = true): string;
}

export declare class CookieJar {
    cookies: Cookie[];
    constructor();

    setCookie(
        cookie: string | http.ServerResponse | http.IncomingMessage | fetch.Response, 
        value?: string = undefined, 
        options: any = {}
    ): CookieJar;
    sendCookies(response: http.ServerResponse, full: boolean = true): CookieJar;
    
    getCookie(name: string): Cookie | undefined
    deleteCookie(cookie: string | Cookie): Cookie;
    
    isEmpty(): boolean;
    includes(name: string): boolean;

    toString(full: boolean = true): string;
}

