const Assignment = require("./Assignment");
const Edupage = require("./Edupage");

/**
 * @typedef {import("../lib/RawData").RawDataObject} RawDataObject
 */

class Test extends Assignment {
	/**
	 * Creates an instance of Test.
	 * @param {RawDataObject} [data={}]
	 * @param {Edupage} [edupage=null]
	 * @memberof Test
	 */
	constructor(data = {}, edupage = null) {
		super(data, edupage);
	}
}

module.exports = Test;