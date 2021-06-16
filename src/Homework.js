const Assignment = require("./Assignment");
const Edupage = require("./Edupage");

/**
 * @typedef {import("../lib/RawData").RawDataObject} RawDataObject
 */

class Homework extends Assignment {
	/**
	 * Creates an instance of Homework.
	 * @param {RawDataObject} [data={}]
	 * @param {Edupage} [edupage=null]
	 * @memberof Homework
	 */
	constructor(data = {}, edupage = null) {
		super(data, edupage);
	}
}

module.exports = Homework;