
/**
 * Holds raw data received from server
 * @typedef {Object<string, any>} RawDataObject
 */

class RawData {
	/**
	 * Creates an instance of RawData.
	 * @param {RawDataObject} [_data=undefined]
	 * @memberof RawData
	 */
	constructor(_data = undefined) {
		/**
		 * @type {RawDataObject}
		 */
		this._data = _data;
	}

	/**
	 * Holds raw data received from server
	 * @type {RawDataObject}
	 * @memberof RawData
	 */
	set _data(value) {
		Object.defineProperty(this, "__data", {
			configurable: true,
			enumerable: false,
			value: value
		});
	}

	/**
	 * Holds raw data received from server
	 * @type {RawDataObject}
	 * @memberof RawData
	 */
	get _data() {
		return this.__data;
	}
}

module.exports = RawData;