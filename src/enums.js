/**
 * Edupage API endpoint
 * @typedef {number} APIEndpoint
 */

/**
 * Gender type
 * @typedef {string} Gender
 */

/**
 * Edupage userString type
 * @typedef {string} UserString
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
	UPLOAD_ATTACHEMENT: 12
};

/**
 * @enum {Gender}
 */
const GENDER = {
	MALE: "M",
	FEMALE: "F"
};

/**
 * @enum {UserString}
 */
const USER_STRING = {
	STUD_PLAN: "StudPlan",
	STUDENT: "Student",
	CUST_PLAN: "CustPlan",
	STUDENT_ONLY: "StudentOnly",
	STUD_TRIEDA: "StudTrieda",
	UCITEL: "Ucitel",
	ALL: "*",
	TRIEDA: "Trieda",
	STUDENT_ALL: "Student*",
	STUDENTONLY_ALL: "StudentOnly*",
	UCITEL_ALL: "Ucitel*",
	ADMIN: "Admin"
};



module.exports = {
	GENDER,
	ENDPOINT,
	USER_STRING
}