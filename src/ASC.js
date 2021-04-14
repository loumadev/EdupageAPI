const debug = require("debug")("edupage:log");
const error = require("debug")("edupage:error");
const RawData = require("../lib/RawData");
const Edupage = require("./Edupage");

debug.log = console.log.bind(console);

class ASC extends RawData {
	/**
	 * Creates an instance of ASC.
	 * @param {import("../lib/RawData").RawDataObject} [data={}]
	 * @param {Edupage} [edupage=null]
	 * @memberof ASC
	 */
	constructor(data = {}, edupage = null) {
		super(data);

		/**
		 * @type {Edupage|string}
		 */
		this.edupage = edupage || data.string || null;

		/**
		 * @type {string}
		 */
		this.loggedUser = data.req_props.loggedUser;

		/**
		 * @type {any[]}
		 */
		this.loggedUserRights = data.req_props.loggedUserRights;

		/**
		 * @type {string}
		 */
		this.timezone = data.req_props.timezone;

		/**
		 * @type {number[]}
		 */
		this.weekendDays = data.req_props.weekendDays;


		/**
		 * @type {string}
		 */
		this.server = data.server;

		/**
		 * @type {string}
		 */
		this.schoolName = data.school_name;

		/**
		 * @type {string}
		 */
		this.lang = data.lang;

		/**
		 * @type {string}
		 */
		this.schoolCountry = data.school_country;

		/**
		 * @type {string}
		 */
		this.schoolyearTurnover = data.schoolyear_turnover;

		/**
		 * @type {string}
		 */
		this.gsecHash = data.gsechash;

		/**
		 * @type {number}
		 */
		this.firstDayOfWeek = data.firstDayOfWeek;
	}

	static parse(html) {
		const data = {};
		const matches = [...html.matchAll(/ASC\.([a-zA-Z0-9_$]+)\s?=\s?([\s\S]+?);/g)];

		if(!matches.length) error(`Failed to parse ASC data from html`, matches);

		for(const [match, key, value] of matches) {
			if(value.startsWith("function")) continue;

			try {
				data[key] = JSON.parse(value);
			} catch(e) {
				error(`Failed to parse JSON from ASC html`, match);
			}
		}

		return data;
	}
}

module.exports = ASC;