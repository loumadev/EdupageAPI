const debug = require("debug")("edupage:log");
const error = require("debug")("edupage:error");
const RawData = require("../lib/RawData");
const Edupage = require("./Edupage");

debug.log = console.log.bind(console);

class Season extends RawData {
	/**
	 * Creates an instance of Season.
	 * @param {import("../lib/RawData").RawDataObject} [data={}]
	 * @param {Edupage} [edupage=null]
	 * @memberof Season
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
		 * @type {Season}
		 */
		this.supSeason = null;

		/**
		 * @type {string[]}
		 */
		this.types = data.typy;

		/**
		 * @type {Season}
		 */
		this.classificationSeason = null;

		/**
		 * @type {boolean}
		 */
		this.isClassification = !!data.klasifikacny;

		if(this.edupage) Season.prototype.init.call(this);
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

		this.supSeason = this.edupage.seasons.find(e => e.id == this._data.nadobdobie) || null;
		if(this.isClassification) this.classificationSeason = this.edupage.seasons.find(e => e.id == this._data.klasifikacny) || null;
	}
}

module.exports = Season;