/**
 * Edupage API endpoint
 * @typedef {number} APIEndpoint
 */

/**
 * Gender type
 * @typedef {string} Gender
 */



/**
 * @enum {APIEndpoint} 
 */
const ENDPOINT = {
	TIMELINE: 1,
	TEST_DATA: 2,
	CARDS_DATA: 3,
	DASHBOARD: 4,
	ONLINE_LESSON_SIGN: 5
};

/**
 * @enum {Gender}
 */
const GENDER = {
	MALE: "M",
	FEMALE: "F"
};



module.exports = {
	GENDER,
	ENDPOINT
}