const {iterate} = require("./utils");

class CookieJar {
	/**
	 * Creates an instance of CookieJar.
	 * @memberof CookieJar
	 */
	constructor() {
		/**
		 * @type {CookieJar.Cookie[]}
		 */
		this.cookies = [];

		if(arguments.length) this.setCookie.apply(this, arguments);
	}

	/**
	 * Adds cookie to the Jar
	 * @param {string|CookieJar.Cookie|http.ServerResponse} cookie Cookie name (requires second parameter), Cookie String, CookieJar.Cookie object, ServerResponseLike object
	 * @param {string} [value=undefined]
	 * @param {Object<string,any>} [options={}]
	 * @return {CookieJar} 
	 * @memberof CookieJar
	 */
	setCookie(cookie, value = undefined, options = {}) {
		//Set by name=value
		if(typeof value !== "undefined") {
			var _cookie = new CookieJar.Cookie();
			_cookie.name = cookie.trim();
			_cookie.value = (value ?? "").trim();

			for(var [i, key, value] of iterate(options)) {
				if(value == true) _cookie.flags.push(key);
				else if(value == false) _cookie.flags.splice(_cookie.flags.indexOf(key), 1);
				else _cookie.props[CookieJar.Cookie.formatKeyword(key) || key] = value;
			}

			this._addCookiesToJar(_cookie);
			return this;
		}

		//Set by Cookie object
		if(cookie instanceof CookieJar.Cookie) {
			this._addCookiesToJar(cookie);
			return this;
		}

		if(typeof cookie == "object") {
			var cookieString = cookie?.headers?.cookie;
			var header = cookie?.headers?.raw?.()?.["set-cookie"];
			var jsonObject = Object.keys(cookie) == "cookies" ? cookie.cookies : null;

			//Set by Request object
			if(cookieString) {
				var cookieStringArray = cookieString.split(";");
				var cookies = CookieJar.Cookie.parse(cookieStringArray);
				this._addCookiesToJar(...cookies);
			}

			//Set by Response object
			if(header) {
				var cookies = CookieJar.Cookie.parse(header);
				this._addCookiesToJar(...cookies);
			}

			//Set by JSON object
			if(jsonObject) {
				for(var cookieObject of jsonObject) {
					var _cookie = new CookieJar.Cookie();
					_cookie.name = cookieObject.name;
					_cookie.value = cookieObject.value;
					_cookie.props = cookieObject.props;
					_cookie.flags = cookieObject.flags;
					this._addCookiesToJar(_cookie);
				}
			}
			return this;
		}

		//TODO: Set by cookie string

		throw new TypeError("Cannot set cookie: " + cookie);
	}

	/**
	 * Retrns cookie object found by name
	 * @param {string} name Cookie name
	 * @return {CookieJar.Cookie} Cookie object if found, otherwise undefined
	 * @memberof CookieJar
	 */
	getCookie(name) {
		this._removeExpiredCookies();
		return this.cookies.find(cookie => cookie.name == name);
	}

	/**
	 * Removes cookie from the Jar
	 * @param {string|CookieJar.Cookie} cookie
	 * @return {CookieJar.Cookie} Deleted cookie
	 * @memberof CookieJar
	 */
	deleteCookie(cookie) {
		var _cookie = null;
		if(typeof cookie === "string") _cookie = this.getCookie(cookie);
		else if(cookie instanceof CookieJar.Cookie) _cookie = cookie;
		else throw new TypeError("Invalid cookie: " + cookie);

		var id = this.cookies.indexOf(_cookie);
		if(id < 0 || !_cookie) return false;
		else this.cookies.splice(id, 1);
		return _cookie;
	}

	/**
	 * Sends header with cookies
	 * @param {http.ServerResponse} response Server response object
	 * @param {boolean} [full=true] Include cookie properties and flags
	 * @return {CookieJar.Cookie} 
	 * @memberof CookieJar
	 */
	sendCookies(response, full = true) {
		this._removeExpiredCookies();
		response.setHeader("Set-Cookie", this.cookies.map(e => e.toString(full)));
		return this;
	}

	/**
	 * Converts Cookie object to cookie string 
	 * @param {boolean} [full=true] Include cookie properties and flags
	 * @return {string} Cookie String
	 * @memberof CookieJar
	 */
	toString(full = true) {
		this._removeExpiredCookies();
		return this.cookies.map(e => e.toString(full)).join("");
	}

	/**
	 * Checks if the Jar is empty
	 * @return {boolean} true if Jar is empty, otherwise false
	 * @memberof CookieJar
	 */
	isEmpty() {
		this._removeExpiredCookies();
		return this.cookies.length == 0;
	}

	/**
	 * Checks if the Jar contains cookie with certain name
	 * @param {string} name Cookie name
	 * @return {boolean} true if Jar contians cookie with certain name, otherwise false
	 * @memberof CookieJar
	 */
	includes(name) {
		this._removeExpiredCookies();
		return !!this.getCookie(name);
	}

	/**
	 * Adds cookies to the Jar
	 * @param {CookieJar.Cookie} cookies
	 * @memberof CookieJar
	 */
	_addCookiesToJar(...cookies) {
		for(var cookie of cookies) {
			this.deleteCookie(cookie.name);
			this.cookies.push(cookie);
		}
		this._removeExpiredCookies();
	}

	/**
	 * Removes expired cookies from the Jar
	 * @memberof CookieJar
	 */
	_removeExpiredCookies() {
		for(var cookie of this.cookies) {
			if(cookie.props["Expires"] && new Date(cookie.props["Expires"]) < new Date()) this.deleteCookie(cookie);
		}
	}
}

/**
 * @typedef {Object} Cookie
 */
CookieJar.Cookie = class Cookie {
	/**
	 * @typedef {Object} CookieProperties
	 * @prop {string} [Expires] The maximum lifetime of the cookie as an HTTP-date timestamp.
	 * @prop {string} [Max-Age] Number of seconds until the cookie expires. A zero or negative number will expire the cookie immediately.
	 * @prop {string} [Domain] Host to which the cookie will be sent.
	 * @prop {string} [Path] A path that must exist in the requested URL, or the browser won't send the `Cookie` header.
	 * @prop {string} [SameSite] Controls whether a cookie is sent with cross-origin requests, providing some protection against cross-site request forgery attacks (CSRF).
	 */

	/**
	 * Creates an instance of Cookie.
	 */
	constructor() {
		this.name = "";
		this.value = "";

		/**
		 * @type {CookieProperties}
		 */
		this.props = {};

		/**
		 * @type {Array<"Secure"|"HttpOnly">}
		 */
		this.flags = [];
	}

	/**
	 * Convert cookie to cookie string
	 * @param {boolean} [full=true] Include cookie properties and flags
	 * @return {string} Cookie String
	 */
	toString(full = true) {
		var head = `${this.name}=${this.value}; `;
		var props = Object.reduce(this.props, (prev, {key, value}) => prev + `${key}=${value}; `, "");
		var flags = this.flags.join("; ");

		return full ? (head + props + flags + (flags ? "; " : "")) : head;
	}

	static keywords = ["Expires", "Max-Age", "Domain", "Path", "Secure", "HttpOnly", "SameSite"];
	static formatKeyword(key) {
		for(var keyword of this.keywords) {
			if(keyword.toLowerCase() == key.toLowerCase()) return keyword;
		}
		return false;
	}

	static parse(cookieStringArray) {
		return cookieStringArray.map(cookieString => {
			var cookie = new CookieJar.Cookie();
			var properties = cookieString.split(/;\s*/);

			for(var property of properties) {
				if(!property) continue;

				var {key, value, flag} = property.match(/(?:(?<key>.*?)=(?<value>.*)|(?<flag>.*))/)?.groups || {};

				if(key) {
					if(!cookie.name && !cookie.value) {
						cookie.name = key.trim();
						cookie.value = value.trim();
					} else {
						cookie.props[this.formatKeyword(key) || key] = value;
					}
				} else if(flag) {
					cookie.flags.push(flag);
				} else {
					//throw new TypeError("Failed to parse cookie: '" + property + "'");
					Server.warn("Failed to parse cookie: '" + property + "'");
				}
			}

			return cookie;
		});
	}
};

module.exports = CookieJar;