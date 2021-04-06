const Edupage = require("./Edupage");

class Classroom {
	/**
	 * Creates an instance of Classroom.
	 * @param {Object<string, any>} [data={}]
	 * @param {Edupage} [edupage=null]
	 * @memberof Classroom
	 */
	constructor(data = {}, edupage = null) {
		/**
		 * Raw object data
		 * @type {Object<string, any>} 
		 */
		this._data = data;

		/**
		 * Edupage instance
		 * @type {Edupage} 
		 */
		this.edupage = edupage;

		/**
		 * @type {boolean} 
		 */
		this.cb_hidden = data.cb_hidden;

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

		if(this.edupage) Classroom.prototype.init.call(this);
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

module.exports = Classroom;
