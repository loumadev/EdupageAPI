const RawData = require("../lib/RawData");

class Period extends RawData {
	constructor(data = null) {
		super(data);

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

		/**
		 * @type {string}
		 */
		this.startTime = data.starttime;

		/**
		 * @type {string}
		 */
		this.endTime = data.endtime;
	}
}

module.exports = Period;