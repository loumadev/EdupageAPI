const debug = require("debug")("edupage:log");
const error = require("debug")("edupage:error");
const RawData = require("../lib/RawData");
const Class = require("./Class");
const Edupage = require("./Edupage");
const Session = require("./Session");
const Student = require("./Student");
const Subject = require("./Subject");
const Teacher = require("./Teacher");

debug.log = console.log.bind(console);

/**
 * @typedef {import("../lib/RawData").RawDataObject} RawDataObject
 */

class Grade extends RawData {
	/**
	 * Creates an instance of Grade.
	 * @param {RawDataObject} [data={}]
	 * @param {Edupage} [edupage=null]
	 * @memberof Grade
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
		this.value = data.data;

		/**
		 * @type {Date}
		 */
		this.createdDate = data.datum ? new Date(data.datum) : null;

		/**
		 * @type {Session}
		 */
		this.session = null//data.mesiac;

		/**
		 * @type {Date}
		 */
		this.signedDate = data.podpisane ? new Date(data.podpisane) : null;

		/**
		 * @type {Date}
		 */
		this.signedByParentDate = data.podpisane_rodic ? new Date(data.podpisane_rodic) : null;

		/**
		 * @type {boolean}
		 */
		this.isSigned = !!(this.signedDate || this.signedByParentDate);

		/**
		 * @type {Subject}
		 */
		this.subject = null//data.predmetid;

		/**
		 * @type {string}
		 */
		this.state = data.stav;

		/**
		 * @type {Student}
		 */
		this.student = null//data.studentid;

		/**
		 * @type {Teacher}
		 */
		this.teacher = null//data.ucitelid;

		/**
		 * @type {string}
		 */
		this.id = data.znamkaid;

		/**
		 * @type {Class}
		 */
		this.class = null//e.TriedaID;

		/**
		 * @type {Class[]}
		 */
		this.classes = null//e.TriedaID.map(t =>);

		/**
		 * @type {string}
		 */
		this.name = null//e.TriedaID.map(t =>);

		/*
				Message->Homework	(by subid)
		
				Grade.props->Udalosti.props	(by udalostid)
				Grade->Homework	(by superid)
		
				Homework->Grade
				Message#znamka->Grade
		
		
				//data: "1"
				//datum: "2021-02-04 16:11:24"
				//mesiac: "P2"
				//podpisane: null
				//podpisane_rodic: "2021-03-12 06:56:12"
				//predmetid: "34606"
				////provider: "edupage"
				//stav: "o"
				//studentid: "82277"
				////timestamp: "2021-03-12 06:56:12"
				//ucitelid: "51298"
				udalostid: "1205852"
				znamkaid: "1205856"
		
				KategoriaID: null
				////Mesiac: "P2"
				////PredmetID: "34606"
				//TriedaID: "82147"
				//Triedy: ["82147"]
				////UcitelID: "51298"
				////--UdalostID: "1205852"
				////copy_of_udalostid: null
				////customid: ""
				group_name: ""
				moredata: {elearning_superid: 12122, etestCards: 1, etestAnswerCards: 0}
				p_farba: ""
				p_meno: "U3.1-vocabulary"
				p_najskor_priemer: "0"
				p_pocet_znamok: "1"
				p_skratka: ""
				p_termin: ""
				p_typ_udalosti: "1"
				p_vaha: "20"
				p_vaha_body: null
				planid: "3105"
				priemer: null
				provider: "edupage"
				stav: "o"
				timestamp: "2021-02-04 16:09:34"
				triedylist: ""
				vlastnik_userid: "Ucitel51298"
		
		
		
		*/

		if(this.edupage) Grade.prototype.init.call(this);
	}

	/**
	 * 
	 * @param {Edupage} [edupage=null]
	 * @memberof Grade
	 */
	init(edupage = null) {
		if(edupage) this.edupage = edupage;
	}

	/**
	 *
	 * @static
	 * @param {string} html
	 * @return {{settings: RawDataObject, data: RawDataObject}} 
	 * @memberof Grade
	 */
	static parse(html) {
		const _settings = (html.match(/initZnamkovanieSettings\(([\s\S]*?)\);/) || "")[1];
		const _data = (html.match(/znamkyStudentViewer\(([\s\S]*?)\);/) || "")[1];

		if(!_settings) error(`[Grade-parser] Failed to parse settings from html`, _settings);
		if(!_data) error(`[Grade-parser] Failed to parse data from html`, _data);

		var settings = {};
		var data = {};

		try {
			settings = JSON.parse(_settings);
		} catch(e) {
			error(`[Grade-parser] Failed to parse settigns as JSON`, _settings);
		}

		try {
			data = JSON.parse(_data);
		} catch(e) {
			error(`[Grade-parser] Failed to parse data as JSON`, _data);
		}

		return {settings, data};
	}
}

module.exports = Grade;