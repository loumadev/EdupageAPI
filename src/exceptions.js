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

module.exports = {
	LoginError,
	ParseError,
	EdupageError,
	APIError,
	MessageError,
	AttachmentError
};