const debug = require("debug")("edupage:log");
const error = require("debug")("edupage:error");
const RawData = require("../lib/RawData");
const Edupage = require("./Edupage");
const {FatalError, ParseError} = require("./exceptions");

debug.log = console.log.bind(console);

/**
 * @typedef {import("../lib/RawData").RawDataObject} RawDataObject
 */

class ASC extends RawData {
	/**
	 * Creates an instance of ASC.
	 * @param {RawDataObject} [data={}] Raw data to initialize the instance with.
	 * @param {Edupage} [edupage=null] Edupage instance to use.
	 * @memberof ASC
	 */
	constructor(data = {}, edupage = null) {
		super(data);

		/**
		 * Edupage instance associated to this object.
		 * @type {Edupage | string}
		 */
		this.edupage = edupage;

		/**
		 * Userstring of the currently logged in user.
		 * @type {string}
		 */
		this.loggedUser = data.req_props.loggedUser;

		/**
		 * Rights of the currently logged in user.
		 * @type {any[]}
		 */
		this.loggedUserRights = data.req_props.loggedUserRights;

		/**
		 * Timezone for the school.
		 * @type {string}
		 */
		this.timezone = data.req_props.timezone;

		/**
		 * Weekend days for the school.
		 * @type {number[]}
		 */
		this.weekendDays = data.req_props.weekendDays;


		/**
		 * Edupage server.
		 * @type {string}
		 * @example "edupage61"
		 */
		this.server = data.server;

		/**
		 * Full name of the school.
		 * @type {string}
		 */
		this.schoolName = data.school_name;

		/**
		 * Language code of the currently logged in user.
		 * @type {string}
		 */
		this.lang = data.lang;

		/**
		 * Country code of the school.
		 * @type {string}
		 */
		this.schoolCountry = data.school_country;

		/**
		 * Turnover of the school in format "MM-DD"
		 * @type {string}
		 * @example "08-01"
		 */
		this.schoolyearTurnover = data.schoolyear_turnover;

		/**
		 * Secure hash used for API calls
		 * @type {string}
		 * @example "94c3f4d3"
		 */
		this.gsecHash = data.gsechash;

		/**
		 * Id used for API calls
		 * @type {string}
		 */
		this.gpid = null;

		/**
		 * List of currently available gpid ids.
		 * @type {string[]}
		 */
		this.gpids = [];

		/**
		 * First day of the week (0 = Sunday, 1 = Monday, ...).
		 * @type {number}
		 */
		this.firstDayOfWeek = data.firstDayOfWeek;
	}

	/**
	 * Parses the HTML page and returns raw ASC data.
	 * @static
	 * @param {string} html HTML page to parse.
	 * @return {RawDataObject} Parsed data.
	 * @memberof ASC
	 */
	static parse(html) {
		const data = {};
		const matches = [...html.matchAll(/ASC\.([a-zA-Z0-9_$]+)\s?=\s?([\s\S]+?);/g)];

		if(!matches.length) return FatalError.throw(new ParseError("Failed to parse ASC data from html"), {html});

		for(const [match, key, value] of matches) {
			if(value.startsWith("function")) continue;

			try {
				data[key] = JSON.parse(value);
			} catch(e) {
				return FatalError.throw(new ParseError("Failed to parse JSON from ASC html"), {html, matches, match, key, value, e});
			}
		}

		return data;
	}
}

module.exports = ASC;