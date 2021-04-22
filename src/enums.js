/**
 * Edupage API endpoint
 * @typedef {number} APIEndpoint
 */

/**
 * Gender type
 * @typedef {string} Gender
 */

/**
 * Edupage primitive enitity type
 * @typedef {string} EntityType
 */

/**
 * Edupage API resporse status
 * @typedef {string} APIStatus
 */

/**
 * Assignment type
 * @typedef {string} AssignmentType
 */

/**
 * 
 * Assignment group
 * @typedef {AssignmentType[]} AssignmentGroup
 */



/**
 * @enum {APIEndpoint} 
 */
const ENDPOINT = {
	DASHBOARD_GET_USER: 1,
	DASHBOARD_GET_CLASSBOOK: 2,
	DASHBOARD_GET_TIMETABLE: 3,
	DASHBOARD_SIGN_ONLINE_LESSON: 4,
	TIMELINE_GET_DATA: 5,
	TIMELINE_GET_REPLIES: 6,
	TIMELINE_GET_CREATED_ITEMS: 7,
	TIMELINE_CREATE_ITEM: 8,
	TIMELINE_CREATE_CONFIRMATION: 9,
	TIMELINE_CREATE_REPLY: 10,
	TIMELINE_FLAG_HOMEWORK: 11,
	TIMELINE_UPLOAD_ATTACHEMENT: 12,
	ELEARNING_TEST_DATA: 13,
	ELEARNING_TEST_RESULTS: 14,
	ELEARNING_CARDS_DATA: 15,
	GRADES_DATA: 16
};

/**
 * @enum {Gender}
 */
const GENDER = {
	MALE: "M",
	FEMALE: "F"
};

/**
 * @enum {EntityType}
 */
const ENTITY_TYPE = {
	STUD_PLAN: "StudPlan",
	STUDENT: "Student",
	CUST_PLAN: "CustPlan",
	STUDENT_ONLY: "StudentOnly",
	STUD_CLASS: "StudTrieda",
	TEACHER: "Ucitel",
	ALL: "*",
	CLASS: "Trieda",
	STUDENT_ALL: "Student*",
	STUDENTONLY_ALL: "StudentOnly*",
	TEACHER_ALL: "Ucitel*",
	ADMIN: "Admin",
	PARENT: "Parent"
};

/**
 * @enum {APIStatus}
 */
const API_STATUS = {
	OK: "ok",
	FAIL: "fail"
};

/**
 * @enum {AssignmentType}
 */
const ASSIGNMENT_TYPE = {
	HOMEWORK: "hw",
	ETEST_HOMEWORK: "etesthw",
	BIG_EXAM: "bexam",
	EXAM: "exam",
	SMALL_EXAM: "sexam",
	ORAL_EXAM: "oexam",
	REPORT_EXAM: "rexam",
	TESTING: "testing",
	TEST: "test",
	PROJECT_EXAM: "pexam",
	ETEST: "etest",
	ETEST_PRINT: "etestprint",
	ETEST_LESSON: "etestlesson",
	LESSON: "lekcia",
	PROJECT: "projekt",
	RESULT: "result",
	CURRICULUM: "ucivo",
	TIMELINE: "timeline"
};

/**
 * @enum {AssignmentGroup}
 */
const ASSIGNMENT_GROUP = {
	HOMEWORK: ["hw", "etesthw"],
	EXAM: ["bexam", "sexam", "oexam", "rexam", "testing"],
	TEST: ["test", "etest", "etestprint"],
	PROJECT: ["pexam", "projekt"],
	PRESENTATION: ["etestlesson", "lekcia"],
	OTHER: ["result", "ucivo", "timeline"]
};


module.exports = {
	GENDER,
	ENDPOINT,
	ENTITY_TYPE,
	API_STATUS,
	ASSIGNMENT_TYPE,
	ASSIGNMENT_GROUP
}