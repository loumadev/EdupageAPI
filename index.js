const Edupage = require("./src/Edupage");
const User = require("./src/User");
const Student = require("./src/Student");
const Teacher = require("./src/Teacher");
const Class = require("./src/Class");
const Classroom = require("./src/Classroom");
const ASC = require("./src/ASC");
const Assignment = require("./src/Assignment");
const Attachment = require("./src/Attachment");
const Grade = require("./src/Grade");
const Homework = require("./src/Homework");
const Lesson = require("./src/Lesson");
const Message = require("./src/Message");
const Parent = require("./src/Parent");
const Period = require("./src/Period");
const Plan = require("./src/Plan");
const Season = require("./src/Season");
const Subject = require("./src/Subject");
const Test = require("./src/Test");
const Timetable = require("./src/Timetable");

const {
	GENDER,
	ENDPOINT,
	ENTITY_TYPE,
	API_STATUS,
	ASSIGNMENT_TYPE,
	ASSIGNMENT_GROUP
} = require("./src/enums");

const {
	LoginError,
	ParseError,
	EdupageError,
	APIError,
	MessageError,
	AttachmentError
} = require("./src/exceptions");

module.exports = {
	ASC,
	Assignment,
	Attachment,
	Class,
	Classroom,
	Edupage,
	Grade,
	Homework,
	Lesson,
	Message,
	Parent,
	Period,
	Plan,
	Season,
	Student,
	Subject,
	Teacher,
	Test,
	Timetable,
	User,
	GENDER,
	ENDPOINT,
	ENTITY_TYPE,
	API_STATUS,
	ASSIGNMENT_TYPE,
	ASSIGNMENT_GROUP,
	LoginError,
	ParseError,
	EdupageError,
	APIError,
	MessageError,
	AttachmentError
};