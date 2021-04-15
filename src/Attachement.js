const RawData = require("../lib/RawData");
const Edupage = require("./Edupage");
const {btoa} = require("../lib/utils");

class Attachement extends RawData {
	/**
	 * Creates an instance of Attachement.
	 * @param {import("../lib/RawData").RawDataObject} [data={}]
	 * @param {Edupage} [edupage=null]
	 * @memberof Attachement
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

		if(this.edupage) Attachement.prototype.init.call(this);
	}

	/**
	 * 
	 * @param {Edupage} [edupage=null]
	 * @memberof Attachement
	 */
	init(edupage = null) {
		if(edupage) this.edupage = edupage;

		this.src = `https://${this.edupage.user.origin}.edupage.org` + (this._data.file || this._data.src);
	}

	toJSON() {
		return JSON.stringify({src: this.src, name: this.name});
	}
}

Attachement.formBoundary = "------EdupageAPIBoundary" + btoa((+new Date * Math.random()).toString()).slice(0, 16);

module.exports = Attachement;