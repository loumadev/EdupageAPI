const debug = require("debug")("edupage:log");
const error = require("debug")("edupage:error");
const RawData = require("../lib/RawData");
const Edupage = require("./Edupage");

debug.log = console.log.bind(console);

class Session extends RawData {
	/**
	 * Creates an instance of Session.
	 * @param {import("../lib/RawData").RawDataObject} [data={}]
	 * @param {Edupage} [edupage=null]
	 * @memberof Session
	 */
	constructor(data = {}, edupage = null) {
		super(data);

		/**
		 * @type {Edupage}
		 */
		this.edupage = edupage;

		/**
		 * @type {string}
		 */
		this.id = data.id;

		/**
		 * @type {Date}
		 */
		this.fromDate = null;

		/**
		 * @type {Date}
		 */
		this.toDate = null;

		/**
		 * @type {string}
		 */
		this.name = data.nazov;

		/**
		 * @type {number}
		 */
		this.halfYear = +data.polrok;

		/**
		 * @type {number}
		 */
		this.index = +data.poradie;

		/**
		 * @type {Session}
		 */
		this.supSession = null;

		/**
		 * @type {string[]}
		 */
		this.types = data.typy;

		/**
		 * @type {Session}
		 */
		this.classificationSession = null;

		/**
		 * @type {boolean}
		 */
		this.isClassification = !!data.klasifikacny;

		if(this.edupage) Session.prototype.init.call(this);
	}

	/**
	 * 
	 * @param {Edupage} [edupage=null]
	 * @memberof Message
	 */
	init(edupage = null) {
		if(edupage) this.edupage = edupage;

		const year = this.edupage.year;

		this.fromDate = new Date(this._data.od.replace("Y0", year).replace("Y1", year + 1));
		this.toDate = new Date(this._data.do.replace("Y0", year).replace("Y1", year + 1));

		this.supSession = this.edupage.sessions.find(e => e.id == this._data.nadobdobie) || null;
		if(this.isClassification) this.classificationSession = this.edupage.sessions.find(e => e.id == this._data.klasifikacny) || null;
	}
}

module.exports = Session;