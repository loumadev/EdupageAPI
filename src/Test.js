const Assignment = require("./Assignment");
const Edupage = require("./Edupage");

class Test extends Assignment {
	/**
	 * Creates an instance of Test.
	 * @param {import("../lib/RawData").RawDataObject} [data={}]
	 * @param {Edupage} [edupage=null]
	 * @memberof Test
	 */
	constructor(data = {}, edupage = null) {
		super(data, edupage);
	}
}

module.exports = Test;