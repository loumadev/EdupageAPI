const Edupage = require("./Edupage");
const {GENDER} = require("./enums");
const User = require("./User");

class Parent extends User {
	/**
	 * Creates an instance of Parent.
	 * @param {Object<string, any>} [data={}]
	 * @param {Edupage} [edupage=null]
	 * @memberof Parent
	 */
	constructor(data = {}, edupage = null) {
		super(data, edupage);

		/**
		 * Edupage instance
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
		this.userString = "Rodic" + this.id;
	}

	/**
	 * 
	 * @param {Edupage} [edupage=null]
	 * @memberof Class
	 */
	init(edupage = null) {
		if(edupage) this.edupage = edupage;
	}
}

module.exports = Parent;