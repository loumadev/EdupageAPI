const RawData = require("../lib/RawData");
const Edupage = require("./Edupage");

/**
 * @typedef {import("../lib/RawData").RawDataObject} RawDataObject
 */

class Classroom extends RawData {
	/**
	 * Creates an instance of Classroom.
	 * @param {RawDataObject} [data={}] Raw data to initialize the instance with.
	 * @param {Edupage} [edupage=null] Edupage instance to use.
	 * @memberof Classroom
	 */
	constructor(data = {}, edupage = null) {
		super(data);

		/**
		 * Edupage instance associated to this object.
		 * @type {Edupage} 
		 */
		this.edupage = edupage;

		/**
		 * Unknown property
		 * @type {boolean} 
		 */
		this.cb_hidden = "cb_hidden" in data ? data.cb_hidden : null;

		/**
		 * Classroom id
		 * @type {string} 
		 */
		this.id = data.id;

		/**
		 * Classroom name
		 * @type {string} 
		 */
		this.name = data.name;

		/**
		 * Classroom short name
		 * @type {string} 
		 */
		this.short = data.short;

		if(this.edupage) Classroom.prototype.init.call(this);
	}

	/**
	 * Initializes instance.
	 * @param {Edupage} [edupage=null] Edupage instance to use.
	 * @memberof Classroom
	 */
	init(edupage = null) {
		if(edupage) this.edupage = edupage;
	}
}

module.exports = Classroom;
