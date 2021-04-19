const Assignment = require("./Assignment");
const Edupage = require("./Edupage");

class Homework extends Assignment {
	/**
	 * Creates an instance of Homework.
	 * @param {import("../lib/RawData").RawDataObject} [data={}]
	 * @param {Edupage} [edupage=null]
	 * @memberof Homework
	 */
	constructor(data = {}, edupage = null) {
		super(data, edupage);
	}
}

module.exports = Homework;