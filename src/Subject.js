const RawData = require("../lib/RawData");

class Subject extends RawData {
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
	}
}

module.exports = Subject;