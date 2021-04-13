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
	ONLINE_LESSON_SIGN: 5,
	MESSAGE_REPLIES: 6,
	CREATE_TIMELINE_ITEM: 7,
	CREATED_TIMELINE_ITEMS: 8,
	CREATE_CONFIRMATION: 9,
	HOMEWORK_FLAG: 10,
	CREATE_MESSAGE_REPLY: 11,
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