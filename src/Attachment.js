const RawData = require("../lib/RawData");
const Edupage = require("./Edupage");
const {btoa} = require("../lib/utils");

/**
 * @typedef {import("../lib/RawData").RawDataObject} RawDataObject
 */

class Attachment extends RawData {
	/**
	 * Creates an instance of Attachment.
	 * @param {RawDataObject} [data={}] Raw data to initialize the instance with.
	 * @param {Edupage} [edupage=null] Edupage instance to use.
	 * @memberof Attachment
	 */
	constructor(data = {}, edupage = null) {
		super(data);

		/**
		 * Edupage instance associated to this object
		 * @type {Edupage} 
		 */
		this.edupage = edupage;

		/**
		 * Name of the attachment file
		 * @type {string}
		 */
		this.name = data.name;

		/**
		 * Absolute URL path to the attachment file uploaded on Edupage cloud server
		 * @type {string}
		 */
		this.src = null;

		if(this.edupage) Attachment.prototype.init.call(this);
	}

	/**
	 * Initializes instance.
	 * @param {Edupage} [edupage=null]
	 * @memberof Attachment
	 */
	init(edupage = null) {
		if(edupage) this.edupage = edupage;

		this.src = `https://${this.edupage.user.origin}.edupage.org` + (this._data.file || this._data.src);
	}

	/**
	 * Converts the `Attachment` object to JSON object
	 * @return {Object<string, string>} JSON object contianing the attachment name as key and the attachment URL as value
	 * @memberof Attachment
	 */
	toJSON() {
		return {[this._data.file]: this.name};
	}
}

Attachment.formBoundary = "------EdupageAPIBoundary" + btoa((+new Date * Math.random()).toString()).slice(0, 16);

module.exports = Attachment;