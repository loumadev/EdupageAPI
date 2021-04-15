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
	DASHBOARD_GET_USER: 1,
	DASHBOARD_SIGN_ONLINE_LESSON: 2,
	TIMELINE_GET_DATA: 3,
	TIMELINE_GET_REPLIES: 4,
	TIMELINE_GET_CREATED_ITEMS: 5,
	TIMELINE_CREATE_ITEM: 6,
	TIMELINE_CREATE_CONFIRMATION: 7,
	TIMELINE_CREATE_REPLY: 8,
	TIMELINE_FLAG_HOMEWORK: 9,
	TIMELINE_UPLOAD_ATTACHEMENT: 10,
	ELEARNING_TEST_DATA: 11,
	ELEARNING_CARDS_DATA: 12,
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