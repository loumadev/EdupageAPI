const fs = require("fs");
const path = require("path");

/**
 * @typedef {import("../lib/RawData").RawDataObject} RawDataObject
 */

class LoginError extends Error {
	constructor(message) {
		super(message);

		this.name = "LoginError";
	}
}

class ParseError extends Error {
	constructor(message) {
		super(message);

		this.name = "ParseError";
	}
}

class EdupageError extends Error {
	constructor(message) {
		super(message);

		this.name = "EdupageError";
	}
}

class APIError extends Error {
	constructor(message, ...data) {
		super(message);

		this.name = "APIError";
		this.data = data;
	}
}

class MessageError extends Error {
	constructor(message, ...data) {
		super(message);

		this.name = "MessageError";
		this.data = data;
	}
}

class AttachmentError extends Error {
	constructor(message, ...data) {
		super(message);

		this.name = "AttachmentError";
		this.data = data;
	}
}

class FatalError extends Error {
	static warningsEnabled = !process.argv.includes("--edu-disable-warnings=true");

	/**
	 * @static
	 * @param {Error} error
	 * @param {RawDataObject} data
	 * @returns {any}
	 * @memberof FatalError
	 */
	static throw(error, data) {
		const date = new Date();
		const filename = `fatal_error_${date.toISOString().replace(/:/g, "-").replace(/\..\d*/, "")}.json`;
		const dirname = path.resolve(__dirname, "../logs");
		const file = path.join(dirname, filename);
		const err = Object.getOwnPropertyNames(error).reduce((obj, prop) => ((obj[prop] = error[prop]), obj), {});	//To convert `Error` object to Object literal

		//Create logs direcory and save error log
		if(!fs.existsSync(dirname)) fs.mkdirSync(dirname);
		fs.writeFileSync(file, JSON.stringify({error: err, data}, null, "\t"));

		const message = `
#
# A fatal error has occurred!
#
# This is probably not your fault!
# If this happens often, please consider reporting a bug.
#
# Error thrown:
#  ${error.stack.split("\n").join("\n#  ")}
#
# Summary:
#  Time: ${date.toString()}
#  EdupageAPI version: v${require("../package.json").version}
#  Node.js version: ${process.version}
#  Error log: ${file}
#
# If you would like to submit an issue, please visit:
#  > https://github.com/loumadev/EdupageAPI/issues
#  (Please, include this error message + error log)
#
`;
		//Log error to stderr and exit process
		console.error(message);
		process.exitCode = 1;

		//To comply jslint
		return undefined;
	}

	/**
	 * @static
	 * @param {Error} error
	 * @param {RawDataObject} data
	 * @returns {any}
	 * @memberof FatalError
	 */
	static warn(error, data) {
		if(!this.warningsEnabled) return;

		const date = new Date();
		const filename = `warning_${date.toISOString().replace(/:/g, "-").replace(/\..\d*/, "")}.json`;
		const dirname = path.resolve(__dirname, "../logs");
		const file = path.join(dirname, filename);
		const err = Object.getOwnPropertyNames(error).reduce((obj, prop) => ((obj[prop] = error[prop]), obj), {});	//To convert `Error` object to Object literal

		//Create logs direcory and save error log
		if(!fs.existsSync(dirname)) fs.mkdirSync(dirname);
		fs.writeFileSync(file, JSON.stringify({error: err, data}, null, "\t"));

		const message = `
#
# An error has occurred!
#
# This is probably not your fault!
# It should not cause the program to crash, but some functionality can be limited.
# If this happens often, please consider reporting a bug.
# You can disable the warnings by including "--edu-disable-warnings=true" as a CLI argument.
#
# Error thrown:
#  ${error.stack.split("\n").join("\n#  ")}
#
# Summary:
#  Time: ${date.toString()}
#  EdupageAPI version: v${require("../package.json").version}
#  Node.js version: ${process.version}
#  Error log: ${file}
#
# If you would like to submit an issue, please visit:
#  > https://github.com/loumadev/EdupageAPI/issues
#  (Please, include this error message + error log)
#
`;
		//Log warning to stderr
		console.warn(message);

		//To comply jslint
		return undefined;
	}
}

module.exports = {
	LoginError,
	ParseError,
	EdupageError,
	APIError,
	MessageError,
	AttachmentError,
	FatalError
};