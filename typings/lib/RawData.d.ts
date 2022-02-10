export = RawData;
/**
 * Holds raw data received from server
 * @typedef {Object<string, any>} RawDataObject
 */
declare class RawData {
    /**
     * Creates an instance of RawData.
     * @param {RawDataObject} [_data=null]
     * @memberof RawData
     */
    constructor(_data?: RawDataObject);
    /**
     * Holds raw data received from server
     * @type {RawDataObject}
     */
    _data: RawDataObject;
}
declare namespace RawData {
    export { RawDataObject };
}
/**
 * Holds raw data received from server
 */
type RawDataObject = {
    [x: string]: any;
};
