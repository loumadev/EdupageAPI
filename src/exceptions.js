const fs = require("fs");
const path = require("path");

/**
 * @typedef {import("../lib/RawData").RawDataObject} RawDataObject
 */

class LoginError extends Error {
	constructor(message) {
		super(message);
	}
}

class ParseError extends Error {
	constructor(message) {
		super(message);
	}
}

class EdupageError extends Error {
	constructor(message) {
		super(message);
	}
}

class APIError extends Error {
	constructor(message, ...data) {
		super(message);

		this.data = data;
	}
}

class MessageError extends Error {
	constructor(message, ...data) {
		super(message);

		this.data = data;
	}
}

class AttachmentError extends Error {
	constructor(message, ...data) {
		super(message);

		this.data = data;
	}
}

class FatalError extends Error {
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

		//Create logs direcory and save error log
		if(!fs.existsSync(dirname)) fs.mkdirSync(dirname);
		fs.writeFileSync(file, JSON.stringify({error, data}, null, "\t"));

		const message = `
#
# A fatal error has occurred!
#
# This is probably not your fault!
# If this often happens, please consider reporting an issue.
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
# If you would like to submit a bug report, please visit:
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