const RawData = require("../lib/RawData");
const Edupage = require("./Edupage");
const {btoa} = require("../lib/utils");

class Attachment extends RawData {
	/**
	 * Creates an instance of Attachment.
	 * @param {import("../lib/RawData").RawDataObject} [data={}]
	 * @param {Edupage} [edupage=null]
	 * @memberof Attachment
	 */
	constructor(data = {}, edupage = null) {
		super(data);

		/**
		 * Edupage instance
		 * @type {Edupage} 
		 */
		this.edupage = edupage;

		/**
		 * @type {string}
		 */
		this.name = data.name;

		/**
		 * @type {string}
		 */
		this.src = null;

		if(this.edupage) Attachment.prototype.init.call(this);
	}

	/**
	 * 
	 * @param {Edupage} [edupage=null]
	 * @memberof Attachment
	 */
	init(edupage = null) {
		if(edupage) this.edupage = edupage;

		this.src = `https://${this.edupage.user.origin}.edupage.org` + (this._data.file || this._data.src);
	}

	toJSON() {
		return {[this._data.file]: this.name};
	}
}

Attachment.formBoundary = "------EdupageAPIBoundary" + btoa((+new Date * Math.random()).toString()).slice(0, 16);

module.exports = Attachment;