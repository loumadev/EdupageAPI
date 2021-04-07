const RawData = require("../lib/RawData");
const {GENDER} = require("./enums");

class Parent extends RawData {
	constructor(data = {}) {
		super(data);

		/**
		* @type {string}
		*/
		this.firstname = data.firstname || null;

		/**
		 * @type {string}
		 */
		this.lastname = data.lastname || null;

		/**
		 * @type {GENDER}
		 */
		this.gender = data.gender || null;

		/**
		 * @type {string}
		 */
		this.id = data.id;
	}
}

module.exports = Parent;