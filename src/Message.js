const debug = require("debug")("edupage:log");
const error = require("debug")("edupage:error");
const RawData = require("../lib/RawData");
const {iterate} = require("../lib/utils");
const Attachement = require("./Attachement");
const Class = require("./Class");
const Edupage = require("./Edupage");
const {ENDPOINT, ENTITY_TYPE} = require("./enums");
const {APIError, EdupageError, MessageError} = require("./exceptions");
const Parent = require("./Parent");
const Plan = require("./Plan");
const Student = require("./Student");
const Teacher = require("./Teacher");
const User = require("./User");

debug.log = console.log.bind(console);

class Message extends RawData {
	/**
	 * Creates an instance of Message.
	 * @param {import("../lib/RawData").RawDataObject} [data={}]
	 * @param {Edupage} [edupage=null]
	 * @memberof Message
	 */
	constructor(data = {}, edupage = null) {
		super(data);

		if(!data.data) data.data = {};
		if(typeof data.data === "string") data.data = JSON.parse(data.data) || {};

		/**
		 * @type {Edupage}
		 */
		this.edupage = edupage;


		/**
		 * @type {string}
		 */
		this.id = data.timelineid;

		/**
		 * @type {string}
		 */
		this.type = data.typ;

		/**
		 * @type {Date}
		 */
		this.creationDate = data.cas_pridania ? new Date(data.cas_pridania) : null;

		/**
		 * @type {Date}
		 */
		this.timelineDate = data.timestamp ? new Date(data.timestamp) : null;

		/**
		 * @type {string}
		 */
		this.otherId = data.otherId || null;

		/**
		 * @type {number}
		 */
		this.repliesCount = +data.pocet_reakcii || 0;

		/**
		 * @type {Date}
		 */
		this.lastReplyDate = data.posledna_reakcia ? new Date(data.posledna_reakcia) : null;

		/**
		 * @type {boolean}
		 */
		this.isRemoved = !!+data.removed;

		/**
		 * @type {boolean}
		 */
		this.isReply = !!this._data.data.textReply;

		/**
		 * @type {boolean}
		 */
		this.isImportant = !!+data.data.receipt || !!+data.data.importantReply;

		/**
		 * @type {Date}
		 */
		this.seenDate = this.isImportant ? (data.data.myConfirmations?.receipt ? new Date(data.data.myConfirmations?.receipt) : null) : this.creationDate;

		/**
		 * @type {boolean}
		 */
		this.isSeen = !!this.seenDate;

		/**
		 * @type {Date}
		 */
		this.likedDate = data.data.myConfirmations?.like ? new Date(data.data.myConfirmations?.like) : null;

		/**
		 * @type {boolean}
		 */
		this.isLiked = !!this.likedDate;

		/**
		 * @type {Date}
		 */
		this.doneDate = null;

		/**
		 * @type {boolean}
		 */
		this.isDone = false;

		/**
		 * @type {boolean}
		 */
		this.isStarred = false;

		/**
		 * @type {number}
		 */
		this.likes = data.data.confirmations?.like || 0;

		/**
		 * @type {string}
		 */
		this.text = data.data.messageContent || data.text;

		/**
		 * @type {string}
		 */
		this.title = data.user_meno;


		/**
		 * ! WARNING: This property is only accessible after calling `message.refresh()`!
		 * @type {number}
		 */
		this.participantsCount = null;

		/**
		 * ! WARNING: This property is only accessible after calling `message.refresh()`!
		 * @type {(User|Teacher|Student|Parent)[]}
		 */
		this.participants = [];

		/**
		 * ! WARNING: This property is only accessible after calling `message.refresh()`!
		 * @type {({user: User|Teacher|Student|Parent, date: Date})[]}
		 */
		this.likedBy = [];

		/**
		 * ! WARNING: This property is only accessible after calling `message.refresh()`!
		 * @type {({user: User|Teacher|Student|Parent, date: Date})[]}
		 */
		this.seenBy = [];


		/**
		 * @type {User|Teacher|Student|Parent}
		 */
		this.owner = null;

		/**
		 * @type {User|Teacher|Student|Parent|Plan|Class}
		 */
		this.recipient = null;

		/**
		 * @type {string}
		 */
		this.recipientUserString = null;

		/**
		 * @type {boolean}
		 */
		this.isWildcardRecipient = false;

		/**
		 * @type {Message}
		 */
		this.replyOf = null;

		/**
		 * @type {Attachement[]}
		 */
		this.attachements = [];

		/**
		 * @type {Message[]}
		 */
		this.replies = [];

		if(this.edupage) Message.prototype.init.call(this);
	}

	/**
	 * 
	 * @param {Edupage} [edupage=null]
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
					if(e.typ == "confirmation") {
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
		if(this._data.reakcia_na && this._data.typ != "confirmation") {
			//Find root message
			const message = this.edupage.timelineItems.find(e => e.id == this._data.reakcia_na);

			if(message) {
				message.replies.push(this);
				this.replyOf = message;
			} else {
				//Cannot find root message
			}
		}

		//Add attachements
		if(this._data.data.attachements) {
			const attchs = this._data.data.attachements;
			this.attachements = Object.keys(attchs).map(e => new Attachement({src: e, name: attchs[e]}, this.edupage));
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
	 * @prop {User|Teacher|Student|Parent} [recipient=null]
	 * @prop {boolean} [parents=false]
	 * @prop {Attachement[]} [attachements=[]]
	 */

	/**
	 *
	 * @param {MessageReplyOptions} options
	 * @memberof Message
	 */
	async reply(options) {
		const {
			text,
			recipient = null,
			parents = false,
			attachements = []
		} = options;

		const res = await this.edupage.api({
			url: ENDPOINT.TIMELINE_CREATE_REPLY,
			data: {
				"groupid": this.id,
				"recipient": this.isReply
					? this.owner.getUserString(parents)
					: (recipient ? recipient.getUserString(parents) : ""),
				"text": text,
				"moredata": JSON.stringify({attachements})
			}
		});

		//Request failed
		if(res.status !== "ok") {
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
	 *
	 * @param {boolean} [state=true]
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
	 *
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
	 *
	 * @param {boolean} [state=true]
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
	 *
	 * @param {boolean} [state=true]
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
	 * 
	 * @param {import("../lib/RawData").RawDataObject} [data=null]
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
		if(res.status !== "ok") throw new APIError(`Failed to refresh message: Invalid status received '${res.status}'`, this, res);

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
	 *
	 * @static
	 * @param {string} name
	 * @return {{firstname: string, lastname: string}} 
	 * @memberof Message
	 */
	static parseUsername(name) {
		const {firstname = "", lastname = ""} = name.match(/(?<firstname>.*?)\s?(?<lastname>\S+)(?:\s\(|$)/)?.groups || {};

		return {firstname, lastname};
	}

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