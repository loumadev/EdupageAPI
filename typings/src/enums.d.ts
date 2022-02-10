/**
 * Edupage API endpoint
 */
export type APIEndpoint = number;
/**
 * Gender type
 */
export type Gender = string;
/**
 * Edupage primitive enitity type
 */
export type EntityType = string;
/**
 * Edupage API resporse status
 */
export type APIStatus = string;
/**
 * Assignment type
 */
export type AssignmentType = string;
/**
 * Assignment group
 */
export type AssignmentGroup = AssignmentType[];
/**
 * Timeline item type
 */
export type TimelineItemType = string;
export type GENDER = Gender;
export namespace GENDER {
    const MALE: string;
    const FEMALE: string;
}
export type ENDPOINT = APIEndpoint;
export namespace ENDPOINT {
    const DASHBOARD_GET_USER: number;
    const DASHBOARD_GET_CLASSBOOK: number;
    const DASHBOARD_GCALL: number;
    const DASHBOARD_SIGN_ONLINE_LESSON: number;
    const TIMELINE_GET_DATA: number;
    const TIMELINE_GET_REPLIES: number;
    const TIMELINE_GET_CREATED_ITEMS: number;
    const TIMELINE_CREATE_ITEM: number;
    const TIMELINE_CREATE_CONFIRMATION: number;
    const TIMELINE_CREATE_REPLY: number;
    const TIMELINE_FLAG_HOMEWORK: number;
    const TIMELINE_UPLOAD_ATTACHMENT: number;
    const ELEARNING_TEST_DATA: number;
    const ELEARNING_TEST_RESULTS: number;
    const ELEARNING_CARDS_DATA: number;
    const GRADES_DATA: number;
    const SESSION_PING: number;
}
export type ENTITY_TYPE = EntityType;
export namespace ENTITY_TYPE {
    const STUD_PLAN: string;
    const STUDENT: string;
    const CUST_PLAN: string;
    const STUDENT_ONLY: string;
    const STUD_CLASS: string;
    const TEACHER: string;
    const ALL: string;
    const CLASS: string;
    const STUDENT_ALL: string;
    const STUDENTONLY_ALL: string;
    const TEACHER_ALL: string;
    const ADMIN: string;
    const PARENT: string;
}
export type API_STATUS = APIStatus;
export namespace API_STATUS {
    const OK: string;
    const FAIL: string;
}
export type ASSIGNMENT_TYPE = AssignmentType;
export namespace ASSIGNMENT_TYPE {
    const HOMEWORK: string;
    const ETEST_HOMEWORK: string;
    const BIG_EXAM: string;
    const EXAM: string;
    const SMALL_EXAM: string;
    const ORAL_EXAM: string;
    const REPORT_EXAM: string;
    const TESTING: string;
    const TEST: string;
    const PROJECT_EXAM: string;
    const ETEST: string;
    const ETEST_PRINT: string;
    const ETEST_LESSON: string;
    const LESSON: string;
    const PROJECT: string;
    const RESULT: string;
    const CURRICULUM: string;
    const TIMELINE: string;
}
export type ASSIGNMENT_GROUP = string[];
export namespace ASSIGNMENT_GROUP {
    const HOMEWORK_1: string[];
    export { HOMEWORK_1 as HOMEWORK };
    const EXAM_1: string[];
    export { EXAM_1 as EXAM };
    const TEST_1: string[];
    export { TEST_1 as TEST };
    const PROJECT_1: string[];
    export { PROJECT_1 as PROJECT };
    export const PRESENTATION: string[];
    export const OTHER: string[];
}
export type TIMELINE_ITEM_TYPE = TimelineItemType;
export namespace TIMELINE_ITEM_TYPE {
    export const MESSAGE: string;
    export const MESSAGE_TO_SUBTITUTER: string;
    export const NOTICEBOARD: string;
    export const GRADE_ANNOUNCEMENT: string;
    export const GRADE: string;
    export const NOTE: string;
    const HOMEWORK_2: string;
    export { HOMEWORK_2 as HOMEWORK };
    export const HOMEWORK_STUDENT_STATE: string;
    export const ABSENCE_NOTE: string;
    export const ABSENCE_NOTE_REMINDER: string;
    export const PROCESS: string;
    export const PROCESS_ADMIN: string;
    export const STUDENT_ABSENT: string;
    export const ACCIDENT: string;
    export const EVENT: string;
    export const TIMETABLE: string;
    export const SUBSTITUTION: string;
    export const CANTEEN_MENU: string;
    export const CANTEEN_CREDIT: string;
    export const CANTEEN_SUSPEND_REINSTATE_ORDERS: string;
    export const CANTEEN_OPENING: string;
    export const SURVEY: string;
    export const PLAN: string;
    export const SETTINGS: string;
    export const ALBUM: string;
    export const NEWS: string;
    export const TEST_ASSIGNMENT: string;
    export const TEST_RESULT: string;
    export const CHAT: string;
    export const CHECK_IN: string;
    export const CONSULTATION_MESSAGE: string;
    export const CONSULTATION: string;
    export const PAYMENTS: string;
    export const SIGN_IN: string;
    const CURRICULUM_1: string;
    export { CURRICULUM_1 as CURRICULUM };
    export const CURRICULUM_REMINDER: string;
    export const BLACKBOARD: string;
    export const STUDENT_PICKUP: string;
    export const TIMETABLE_CLOUD_GENERATE: string;
    export const CONFIRMATION: string;
    export const CONTEST: string;
}
