const debug = require("debug")("edupage:log");
const error = require("debug")("edupage:error");
const RawData = require("../lib/RawData");
const {iterate} = require("../lib/utils");
const Attachment = require("./Attachment");
const Class = require("./Class");
const Edupage = require("./Edupage");
const {ENDPOINT, ENTITY_TYPE, API_STATUS, TIMELINE_ITEM_TYPE} = require("./enums");
const {APIError, EdupageError, MessageError} = require("./exceptions");
const Parent = require("./Parent");
const Plan = require("./Plan");
const Student = require("./Student");
const Teacher = require("./Teacher");
const User = require("./User");
const Assignment = require("./Assignment");

debug.log = console.log.bind(console);

/**
 * @typedef {import("../lib/RawData").RawDataObject} RawDataObject
 */

class Message extends RawData {
	/**
	 * Creates an instance of Message.
	 * @param {RawDataObject} [data={}] Raw data to initialize the instance with.
	 * @param {Edupage} [edupage=null] Edupage instance to use.
	 * @memberof Message
	 */
	constructor(data = {}, edupage = null) {
		super(data);

		if(!data.data) data.data = {};
		if(typeof data.data === "string") data.data = JSON.parse(data.data) || {};

		/**
		 * Edupage instance associated to this object.
		 * @type {Edupage}
		 */
		this.edupage = edupage;


		/**
		 * Timeline item id
		 * @type {string}
		 */
		this.id = data.timelineid;

		/**
		 * Timeline item type
		 * @type {string}
		 */
		this.type = data.typ;

		/**
		 * Date when the message was created
		 * @type {Date}
		 */
		this.creationDate = data.cas_pridania ? new Date(data.cas_pridania) : null;

		/**
		 * Date when the message was last updated
		 * @type {Date}
		 */
		this.timelineDate = data.timestamp ? new Date(data.timestamp) : null;

		/**
		 * ID of the user who created the message
		 * @type {string}
		 */
		this.otherId = data.otherId || null;

		/**
		 * Number of replies to the message
		 * @type {number}
		 */
		this.repliesCount = +data.pocet_reakcii || 0;

		/**
		 * Date of the last reply to the message
		 * @type {Date}
		 */
		this.lastReplyDate = data.posledna_reakcia ? new Date(data.posledna_reakcia) : null;

		/**
		 * Flag indicating whether the message was removed
		 * @type {boolean}
		 */
		this.isRemoved = !!+data.removed;

		/**
		 * Flag indicating whether the message is reply
		 * @type {boolean}
		 */
		this.isReply = !!this._data.data.textReply;

		/**
		 * Flag indicating whether the message is sent as important
		 * @type {boolean}
		 */
		this.isImportant = !!+data.data.receipt || !!+data.data.importantReply;

		/**
		 * Date when the currently logged in user read the message. If the message is not important, this is same as `Message.creationDate`.
		 * @type {Date}
		 */
		this.seenDate = this.isImportant ? (data.data.myConfirmations?.receipt ? new Date(data.data.myConfirmations?.receipt) : null) : this.creationDate;

		/**
		 * Flag indicating whether the message was seen. If the message is not important, this will be always `true`.
		 * @type {boolean}
		 */
		this.isSeen = !!this.seenDate;

		/**
		 * Date when the currently logged in user liked the message.
		 * @type {Date}
		 */
		this.likedDate = data.data.myConfirmations?.like ? new Date(data.data.myConfirmations?.like) : null;

		/**
		 * Flag indicating whether the message was liked.
		 * @type {boolean}
		 */
		this.isLiked = !!this.likedDate;

		/**
		 * Date when the currently logged in user marked this message as done.
		 * @type {Date}
		 */
		this.doneDate = null;

		/**
		 * Flag indicating whether the message was marked as done.
		 * @type {boolean}
		 */
		this.isDone = false;

		/**
		 * Flag indicating whether the message was starred.
		 * @type {boolean}
		 */
		this.isStarred = false;

		/**
		 * Number of likes the message has.
		 * @type {number}
		 */
		this.likes = data.data.confirmations?.like || 0;

		/**
		 * The textual content of the message.
		 * @type {string}
		 */
		this.text = data.data.messageContent || data.text;

		/**
		 * Title of the message.
		 * @type {string}
		 */
		this.title = data.user_meno;


		/**
		 * Number of participants in the message.
		 * ! WARNING: This property is only accessible after calling `message.refresh()`!
		 * @type {number}
		 */
		this.participantsCount = null;

		/**
		 * List of participants in the message.
		 * ! WARNING: This property is only accessible after calling `message.refresh()`!
		 * @type {(User | Teacher | Student | Parent)[]}
		 */
		this.participants = [];

		/**
		 * List of users who liked the message.
		 * ! WARNING: This property is only accessible after calling `message.refresh()`!
		 * @type {({user: User | Teacher | Student | Parent, date: Date})[]}
		 */
		this.likedBy = [];

		/**
		 * List of users who have seen the message.
		 * ! WARNING: This property is only accessible after calling `message.refresh()`!
		 * @type {({user: User | Teacher | Student | Parent, date: Date})[]}
		 */
		this.seenBy = [];


		/**
		 * Author of the message.
		 * @type {User | Teacher | Student | Parent}
		 */
		this.owner = null;

		/**
		 * Recipient of the message.
		 * @type {User | Teacher | Student | Parent | Plan | Class}
		 */
		this.recipient = null;

		/**
		 * Recipient of the message as user string. This can be used, when the exact recipient is not known (e.g. when the recipient is everyone, this will be '*').
		 * @type {string}
		 */
		this.recipientUserString = null;

		/**
		 * Flag indicating whether the message has no exact recipient (e.g. userstring contains '*').
		 * @type {boolean}
		 */
		this.isWildcardRecipient = false;

		/**
		 * Root message of the reply.
		 * @type {Message}
		 */
		this.replyOf = null;


		/**
		 * Resources attached to the message.
		 * @type {Attachment[]}
		 */
		this.attachments = [];

		/**
		 * List of replies to the message.
		 * @type {Message[]}
		 */
		this.replies = [];

		/**
		 * Assignment attached to the message.
		 * @type {Assignment}
		 */
		this.assignment = null;

		if(this.edupage) Message.prototype.init.call(this);
	}

	/**
	 * Initializes instance.
	 * @param {Edupage} [edupage=null] Edupage instance to use.
	 * @memberof Message
	 */
	init(edupage = null) {
		if(edupage) this.edupage = edupage;

		//Update attributes
		if("item" in this._data) {
			const data = this._data.item;

			this.timelineDate = data.timestamp ? new Date(data.timestamp) : null;
			this.repliesCount = +data.pocet_reakcii || 0;
			this.lastReplyDate = data.posledna_reakcia ? new Date(data.posledna_reakcia) : null;
			this.isRemoved = !!+data.removed;
			this.seenDate = this.isImportant ? (this._data.reakcie[0]?.data?.myConfirmations?.receipt ? new Date(this._data.reakcie[0]?.data?.myConfirmations?.receipt) : null) : this.creationDate;
			this.isSeen = !!this.seenDate;
			this.likedDate = this._data.reakcie[0]?.data?.myConfirmations?.like ? new Date(this._data.reakcie[0]?.data?.myConfirmations?.like) : null;
			this.isLiked = !!this.likedDate;
			this.likes = data.data.confirmations?.like || 0;
		}

		//Add more data
		if("numParticipants" in this._data) this.participantsCount = this._data.numParticipants;
		if("participants" in this._data) this.participants = iterate(this._data.participants).map(([i, user, data]) => this.edupage.getUserByUserString(user) || User.from(user, data, this.edupage));
		if("reakcie" in this._data) {
			this._data.reakcie
				.forEach(e => {
					if(e.pomocny_zaznam) return;
					if(e.timelineid == this._data.item?.timelineid) return;
					if(e.cas_pridania == this._data.cas_pridania) return;
					if(e.typ == TIMELINE_ITEM_TYPE.CONFIRMATION) {
						const data = Message.parseUsername(e.vlastnik_meno);
						const user = this.edupage.getUserByUserString(e.vlastnik) || User.from(e.vlastnik, data, this.edupage);

						if(e.data.like) this.likedBy.push({user, date: new Date(e.data.like)});
						if(this.isImportant) this.seenBy.push({user, date: new Date(e.cas_pridania)});
					} else {
						if(this.replies.some(t => t.id == e.timelineid)) return;

						//After init it should get pushed automatically
						const msg = new Message(e, this.edupage);

						//If it wasn't pushed into replies, push it manually
						if(!this.replies.includes(msg)) this.replies.push(msg);
					}
				});

			this.repliesCount = this.replies.length;
		}

		//Setup flags
		const props = this._data.userProps || this.edupage._data.timelineUserProps[this.id] || {};
		this.doneDate = props.doneMaxCas ? new Date(props.doneMaxCas) : null;
		this.isDone = !!this.doneDate;
		this.isStarred = !!+props.starred;

		//Add owner object
		if(this._data.vlastnik) {
			//Parse name of the owner
			const data = Message.parseUsername(this._data.vlastnik_meno);

			//Assign owner object
			this.owner = this.edupage.getUserByUserString(this._data.vlastnik) ||
				User.from(this._data.vlastnik, data, this.edupage);
		}

		//Add recipient object
		if(this._data.user) {
			const {recipient, wildcard} = this.getRecipient(this._data.user);

			this.recipient = recipient;
			this.isWildcardRecipient = wildcard;
			this.recipientUserString = this._data.user;
		}

		//Add reply
		if(this._data.reakcia_na && this._data.typ != TIMELINE_ITEM_TYPE.CONFIRMATION) {
			//Find root message
			const message = this.edupage.timelineItems.find(e => e.id == this._data.reakcia_na);

			if(message) {
				message.replies.push(this);
				this.replyOf = message;
			} else {
				//Cannot find root message
			}
		}

		//Add attachments
		if(this._data.data.attachements) {
			const attchs = this._data.data.attachements;
			this.attachments = Object.keys(attchs).map(e => new Attachment({src: e, name: attchs[e]}, this.edupage));
		}

		//Add homework
		if(this._data.data.superid) {
			this.assignment = this.edupage.assignments.find(e => e.superId == this._data.data.superid);
		}

		//TODO: implement this._data.participantGroups = {
		//TODO: 	hasParticipants: 1
		//TODO: 	id: "CustPlan3610"
		//TODO: 	name: "Telesná a športová výchova · I.BP - I"
		//TODO: 	spec: "Rodičia a žiaci"
		//TODO: 	type: "group"
		//TODO: }[]

	}

	/**
	 * @typedef {Object} MessageReplyOptions
	 * @prop {string} text
	 * @prop {User | Teacher | Student | Parent} [recipient=null]
	 * @prop {boolean} [parents=false]
	 * @prop {Attachment[]} [attachments=[]]
	 */

	/**
	 * Creates a new reply to the message
	 * @param {MessageReplyOptions} options
	 * @memberof Message
	 */
	async reply(options) {
		const {
			text,
			recipient = null,
			parents = false,
			attachments = []
		} = options;

		const res = await this.edupage.api({
			url: ENDPOINT.TIMELINE_CREATE_REPLY,
			data: {
				"groupid": this.id,
				"recipient": this.isReply
					? this.owner.getUserString(parents)
					: (recipient ? recipient.getUserString(parents) : ""),
				"text": text,
				"moredata": JSON.stringify({attachements: attachments})
			}
		});

		//Request failed
		if(res.status !== API_STATUS.OK) {
			error(`[Reply] Received invalid status from the server '${res.status}'`);
			throw new APIError(`Failed to send message: Invalid status received '${res.status}'`, res);
		}

		//Add reply to root message
		const _len = this.replies.length;
		this._data.reakcie = res.data.reakcie;
		Message.prototype.init.call(this);

		//Check for successful creation of the reply
		if(this.replies.length > _len) {
			if(this.replies.length > _len + 1) debug(`[Reply] Message contains multiple new replies (${_len} -> ${this.replies.length})`);
			return this.replies[this.replies.length - 1];
		} else {
			error(`[Reply] Message had ${_len} replies, and now has ${this.replies.length}`, res, this.replies);
			throw new MessageError(`Failed to get sent message: No new replies were created`);
		}
	}

	/**
	 * Marks the message as liked
	 * @param {boolean} [state=true] State to use (like/unlike)
	 * @return {Promise<boolean>} 
	 * @memberof Message
	 */
	async markAsLiked(state = true) {
		if(!this.edupage) throw new EdupageError(`Message does not have assigned Edupage instance yet`);

		//Load data
		const res = await this.edupage.api({
			url: ENDPOINT.TIMELINE_CREATE_CONFIRMATION,
			data: {
				"groupid": this.id,
				"confirmType": "like",
				"val": (+state).toString()
			}
		});

		await this.refresh(res);

		return state;
	}

	/**
	 * Marks the message as seen
	 * @return {Promise<void>} 
	 * @memberof Message
	 */
	async markAsSeen() {
		if(!this.edupage) throw new EdupageError(`Message does not have assigned Edupage instance yet`);

		//Load data
		const res = await this.edupage.api({
			url: ENDPOINT.TIMELINE_CREATE_CONFIRMATION,
			data: {
				"groupid": this.id,
				"confirmType": "receipt",
				"val": ""
			}
		});

		await this.refresh(res);
	}

	/**
	 * Marks the message as done
	 * @param {boolean} [state=true] State to use (done/not done)
	 * @return {Promise<boolean>} 
	 * @memberof Message
	 */
	async markAsDone(state = true) {
		if(!this.edupage) throw new EdupageError(`Message does not have assigned Edupage instance yet`);

		//Load data
		const res = await this.edupage.api({
			url: ENDPOINT.TIMELINE_FLAG_HOMEWORK,
			data: {
				"homeworkid": "timeline:" + this.id,
				"flag": "done",
				"value": (+state).toString()
			}
		});

		if(!("timelineUserProps" in res)) throw new APIError(`Failed to refresh message: Invalid status received '${res.status}'`, this, res);

		this._data.userProps = null;
		this.edupage._data.timelineUserProps = res.timelineUserProps;
		Message.prototype.init.call(this);

		return state;
	}

	/**
	 * Marks the message as starred
	 * @param {boolean} [state=true] State to use (starred/not starred)
	 * @return {Promise<boolean>} 
	 * @memberof Message
	 */
	async markAsStarred(state = true) {
		if(!this.edupage) throw new EdupageError(`Message does not have assigned Edupage instance yet`);

		//Load data
		const res = await this.edupage.api({
			url: ENDPOINT.TIMELINE_FLAG_HOMEWORK,
			data: {
				"homeworkid": "timeline:" + this.id,
				"flag": "important",
				"value": (+state).toString()
			}
		});

		if(!("timelineUserProps" in res)) throw new APIError(`Failed to refresh message: Invalid status received '${res.status}'`, this, res);

		this._data.userProps = null;
		this.edupage._data.timelineUserProps = res.timelineUserProps;
		Message.prototype.init.call(this);

		return state;
	}

	/**
	 * Refreshes message replies and some other fields
	 * @param {RawDataObject} [data=null] Raw data to use instead of requesting from the server
	 * @memberof Message
	 */
	async refresh(data = null) {
		if(!this.edupage) throw new EdupageError(`Message does not have assigned Edupage instance yet`);

		//Load data
		const res = data || await this.edupage.api({
			url: ENDPOINT.TIMELINE_GET_REPLIES,
			data: {
				groupid: this.id,
				lastsync: ""
			}
		});

		//Invalid response
		if(res.status !== API_STATUS.OK) throw new APIError(`Failed to refresh message: Invalid status received '${res.status}'`, this, res);

		//Parse message data of each reply
		res.data.reakcie.forEach(e => {
			if(typeof e.data === "string") e.data = JSON.parse(e.data);
		});

		//Assign data
		this._data = {...this._data, ...res.data};

		//Init Message object
		Message.prototype.init.call(this);
	}

	/**
	 * Parses name of the user
	 * @static
	 * @param {string} name Name to parse
	 * @return {{firstname: string, lastname: string}} Parsed name
	 * @memberof Message
	 */
	static parseUsername(name) {
		const {firstname = "", lastname = ""} = name.match(/(?<firstname>.*?)\s?(?<lastname>\S+)(?:\s\(|$)/)?.groups || {};

		return {firstname, lastname};
	}

	/**
	 * Searches for the user object from userstring. If user is not found, the parsed userstring is returned.
	 * @private
	 * @param {string} userString Userstring to search for
	 * @return {{recipient: (User | Teacher | Student | Parent | Plan | Class), wildcard: boolean}} User object and wildcard flag
	 * @memberof Message
	 */
	getRecipient(userString) {
		//Ignore parents just for now
		userString = userString.replace("Only", "");

		//Parse userString
		const {type, id, wildcard} = User.parseUserString(userString);
		let recipient = null;

		if(type == ENTITY_TYPE.TEACHER) recipient = this.edupage.teachers.find(e => e.id == id);
		if(type == ENTITY_TYPE.STUDENT) recipient = this.edupage.students.find(e => e.id == id);
		if(type == ENTITY_TYPE.PARENT) recipient = this.edupage.parents.find(e => e.id == id);
		if(type == ENTITY_TYPE.STUD_PLAN || type == ENTITY_TYPE.CUST_PLAN) recipient = this.edupage.plans.find(e => e.id == id);
		if(type == ENTITY_TYPE.STUD_CLASS) recipient = this.edupage.classes.find(e => e.id == id);
		if(type == ENTITY_TYPE.CLASS) recipient = this.edupage.plans.find(e => e.customClassId == id);

		return {recipient, wildcard};
	}
}

module.exports = Message;