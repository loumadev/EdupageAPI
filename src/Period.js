const RawData = require("../lib/RawData");

/**
 * @typedef {import("../lib/RawData").RawDataObject} RawDataObject
 */

class Period extends RawData {
	/**
	 * Creates an instance of Period.
	 * @param {RawDataObject} [data=null]
	 * @memberof Period
	 */
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

	// eslint-disable-next-line valid-jsdoc
	/**
	 * Creates new invalid Period
	 * @static
	 * @param {{id?: string?, name?: string, short?: string, startTime?: string, endTime?: string}} [data=null] Data to be used to create the Period (if there's any)
	 * @return {Period} Created Period
	 * @memberof Period
	 */
	static getInvalid(data = null) {
		const {
			id = null,
			name = "Unknown Period",
			short = "?",
			startTime = "00:00",
			endTime = "00:00"
		} = data || {};

		return new Period({
			id,
			name,
			short,
			startTime,
			endTime
		});
	}
}

module.exports = Period;