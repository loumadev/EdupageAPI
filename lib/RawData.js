/**
 * Holds raw data received from server
 * @typedef {Object<string, any>} RawDataObject
 */
class RawData {
	/**
	 * Creates an instance of RawData.
	 * @param {RawDataObject} [_data=null]
	 * @memberof RawData
	 */
	constructor(_data = null) {
		Object.defineProperty(this, "_data", {
			enumerable: false,
			writable: true
		});

		/**
		 * Holds raw data received from server
		 * @type {RawDataObject}
		 */
		this._data = _data;
	}
}

module.exports = RawData;