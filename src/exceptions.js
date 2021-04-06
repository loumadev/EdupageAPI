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

module.exports = {
	LoginError,
	ParseError,
	EdupageError
};