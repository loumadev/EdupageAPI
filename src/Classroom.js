const RawData = require("../lib/RawData");
const Edupage = require("./Edupage");

class Classroom extends RawData {
	/**
	 * Creates an instance of Classroom.
	 * @param {import("../lib/RawData").RawDataObject} [data={}]
	 * @param {Edupage} [edupage=null]
	 * @memberof Classroom
	 */
	constructor(data = {}, edupage = null) {
		super(data);

		/**
		 * Edupage instance
		 * @type {Edupage} 
		 */
		this.edupage = edupage;

		/**
		 * @type {boolean} 
		 */
		this.cb_hidden = "cb_hidden" in data ? data.cb_hidden : null;

		/**
		 * @type {string} 
		 */
		this.id = data.id;

		/**
		 * @type {string} 
		 */
		this.name = data.name;

		/**
		 * @type {string} 
		 */
		this.short = data.short;

		if(this.edupage) Classroom.prototype.init.call(this);
	}

	/**
	 * 
	 * @param {Edupage} [edupage=null]
	 * @memberof Classroom
	 */
	init(edupage = null) {
		if(edupage) this.edupage = edupage;
	}
}

module.exports = Classroom;
