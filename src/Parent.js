class Parent {
	constructor(data = {}) {
		/**
		 * Raw object data
		 * @type {Object<string, any>} 
		 */
		this._data = data;

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