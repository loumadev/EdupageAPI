const Edupage = require("./Edupage");
const {GENDER, ENTITY_TYPE} = require("./enums");
const User = require("./User");

/**
 * @typedef {import("../lib/RawData").RawDataObject} RawDataObject
 */

class Parent extends User {
	/**
	 * Creates an instance of Parent.
	 * @param {RawDataObject} [data={}]
	 * @param {Edupage} [edupage=null]
	 * @memberof Parent
	 */
	constructor(data = {}, edupage = null) {
		super(data, edupage);

		/**
		 * Edupage instance associated to this object
		 * @type {Edupage} 
		 */
		this.edupage = edupage;

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

		/**
		 * @type {string}
		 */
		this.userString = ENTITY_TYPE.PARENT + this.id;
	}

	/**
	 * 
	 * @param {Edupage} [edupage=null]
	 * @memberof Parent
	 */
	init(edupage = null) {
		if(edupage) this.edupage = edupage;
	}
}

module.exports = Parent;