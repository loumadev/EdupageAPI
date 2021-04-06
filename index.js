const Edupage = require("./src/Edupage");
const User = require("./src/User");
const Student = require("./src/Student");
const Teacher = require("./src/Teacher");
const Class = require("./src/Class");
const Classroom = require("./src/Classroom");
const {
	LoginError,
	ParseError,
	EdupageError
} = require("./src/exceptions");

module.exports = {
	Edupage,
	User,
	Student,
	Teacher,
	Class,
	Classroom,
	LoginError,
	ParseError,
	EdupageError
};