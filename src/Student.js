const Class = require("./Class");
const Edupage = require("./Edupage");
const {ENTITY_TYPE} = require("./enums");
const Parent = require("./Parent");
const User = require("./User");

/**
 * @typedef {import("../lib/RawData").RawDataObject} RawDataObject
 */

class Student extends User {
	/**
	 * Creates an instance of Student.
	 * @param {RawDataObject} [data={}]
	 * @param {Edupage} [edupage=null]
	 * @memberof Student
	 */
	constructor(data = {}, edupage = null) {
		super(data, edupage);

		/**
		 * Edupage instance associated to this object
		 * @type {Edupage} 
		 */
		this.edupage = edupage;

		/**
		 * @type {number}
		 */
		this.number = +data.number;

		/**
		 * @type {number}
		 */
		this.numberInClass = +data.numberinclass;

		/**
		 * @type {string}
		 */
		this.parent1Id = data.parent1id;

		/**
		 * @type {string}
		 */
		this.parent2Id = data.parent2id;

		/**
		 * @type {string}
		 */
		this.parent3Id = data.parent3id;

		/**
		 * @type {string}
		 */
		this.userString = ENTITY_TYPE.STUDENT + this.id;


		/**
		 * @type {Parent}
		 */
		this.parent1 = data.parent1id ? new Parent({id: data.parent1id}, edupage) : null;

		/**
		 * @type {Parent}
		 */
		this.parent2 = data.parent2id ? new Parent({id: data.parent2id}, edupage) : null;

		/**
		 * @type {Parent}
		 */
		this.parent3 = data.parent3id ? new Parent({id: data.parent3id}, edupage) : null;


		/**
		 * @type {Class}
		 */
		this.class = null;

		if(this.edupage) Student.prototype.init.call(this);
	}

	/**
	 * 
	 * @param {Edupage} [edupage=null]
	 * @memberof Parent
	 */
	init(edupage = null) {
		if(edupage) this.edupage = edupage;

		this.class = this.edupage.classes.find(e => e.id == this._data.classid);
		this.parent1 = this.parent1 ? this.edupage.parents.find(e => e.id == this.parent1.id) : this.parent1;
		this.parent2 = this.parent2 ? this.edupage.parents.find(e => e.id == this.parent2.id) : this.parent2;
		this.parent3 = this.parent3 ? this.edupage.parents.find(e => e.id == this.parent3.id) : this.parent3;
	}

	/**
	 *
	 * @param {boolean} [parents=false]
	 * @return {string} 
	 * @memberof Student
	 */
	getUserString(parents = false) {
		return parents ?
			this.userString.split(/(?<=[a-z])(?=[0-9])/).join("Only") :
			this.userString;
	}
}

module.exports = Student;