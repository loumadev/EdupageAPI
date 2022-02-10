export = Message;
/**
 * @typedef {import("../lib/RawData").RawDataObject} RawDataObject
 */
declare class Message extends RawData {
    /**
     * Parses name of the user
     * @static
     * @param {string} name Name to parse
     * @return {{firstname: string, lastname: string}} Parsed name
     * @memberof Message
     */
    static parseUsername(name: string): {
        firstname: string;
        lastname: string;
    };
    /**
     * Creates an instance of Message.
     * @param {RawDataObject} [data={}] Raw data to initialize the instance with.
     * @param {Edupage} [edupage=null] Edupage instance to use.
     * @memberof Message
     */
    constructor(data?: RawDataObject, edupage?: Edupage);
    /**
     * Edupage instance associated to this object.
     * @type {Edupage}
     */
    edupage: Edupage;
    /**
     * Timeline item id
     * @type {string}
     */
    id: string;
    /**
     * Timeline item type
     * @type {string}
     */
    type: string;
    /**
     * Date when the message was created
     * @type {Date}
     */
    creationDate: Date;
    /**
     * Date when the message was last updated
     * @type {Date}
     */
    timelineDate: Date;
    /**
     * ID of the user who created the message
     * @type {string}
     */
    otherId: string;
    /**
     * Number of replies to the message
     * @type {number}
     */
    repliesCount: number;
    /**
     * Date of the last reply to the message
     * @type {Date}
     */
    lastReplyDate: Date;
    /**
     * Flag indicating whether the message was removed
     * @type {boolean}
     */
    isRemoved: boolean;
    /**
     * Flag indicating whether the message is reply
     * @type {boolean}
     */
    isReply: boolean;
    /**
     * Flag indicating whether the message is sent as important
     * @type {boolean}
     */
    isImportant: boolean;
    /**
     * Date when the currently logged in user read the message. If the message is not important, this is same as `Message.creationDate`.
     * @type {Date}
     */
    seenDate: Date;
    /**
     * Flag indicating whether the message was seen. If the message is not important, this will be always `true`.
     * @type {boolean}
     */
    isSeen: boolean;
    /**
     * Date when the currently logged in user liked the message.
     * @type {Date}
     */
    likedDate: Date;
    /**
     * Flag indicating whether the message was liked.
     * @type {boolean}
     */
    isLiked: boolean;
    /**
     * Date when the currently logged in user marked this message as done.
     * @type {Date}
     */
    doneDate: Date;
    /**
     * Flag indicating whether the message was marked as done.
     * @type {boolean}
     */
    isDone: boolean;
    /**
     * Flag indicating whether the message was starred.
     * @type {boolean}
     */
    isStarred: boolean;
    /**
     * Number of likes the message has.
     * @type {number}
     */
    likes: number;
    /**
     * The textual content of the message.
     * @type {string}
     */
    text: string;
    /**
     * Title of the message.
     * @type {string}
     */
    title: string;
    /**
     * Number of participants in the message.
     * ! WARNING: This property is only accessible after calling `message.refresh()`!
     * @type {number}
     */
    participantsCount: number;
    /**
     * List of participants in the message.
     * ! WARNING: This property is only accessible after calling `message.refresh()`!
     * @type {(User | Teacher | Student | Parent)[]}
     */
    participants: (User | Teacher | Student | Parent)[];
    /**
     * List of users who liked the message.
     * ! WARNING: This property is only accessible after calling `message.refresh()`!
     * @type {({user: User | Teacher | Student | Parent, date: Date})[]}
     */
    likedBy: {
        user: User | Teacher | Student | Parent;
        date: Date;
    }[];
    /**
     * List of users who have seen the message.
     * ! WARNING: This property is only accessible after calling `message.refresh()`!
     * @type {({user: User | Teacher | Student | Parent, date: Date})[]}
     */
    seenBy: {
        user: User | Teacher | Student | Parent;
        date: Date;
    }[];
    /**
     * Author of the message.
     * @type {User | Teacher | Student | Parent}
     */
    owner: User | Teacher | Student | Parent;
    /**
     * Recipient of the message.
     * @type {User | Teacher | Student | Parent | Plan | Class}
     */
    recipient: User | Teacher | Student | Parent | Plan | Class;
    /**
     * Recipient of the message as user string. This can be used, when the exact recipient is not known (e.g. when the recipient is everyone, this will be '*').
     * @type {string}
     */
    recipientUserString: string;
    /**
     * Flag indicating whether the message has no exact recipient (e.g. userstring contains '*').
     * @type {boolean}
     */
    isWildcardRecipient: boolean;
    /**
     * Root message of the reply.
     * @type {Message}
     */
    replyOf: Message;
    /**
     * Resources attached to the message.
     * @type {Attachment[]}
     */
    attachments: Attachment[];
    /**
     * List of replies to the message.
     * @type {Message[]}
     */
    replies: Message[];
    /**
     * Assignment attached to the message.
     * @type {Assignment}
     */
    assignment: Assignment;
    /**
     * Initializes instance.
     * @param {Edupage} [edupage=null] Edupage instance to use.
     * @memberof Message
     */
    init(edupage?: Edupage): void;
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
    reply(options: {
        text: string;
        recipient?: User | Teacher | Student | Parent;
        parents?: boolean;
        attachments?: Attachment[];
    }): Promise<Message>;
    /**
     * Marks the message as liked
     * @param {boolean} [state=true] State to use (like/unlike)
     * @return {Promise<boolean>}
     * @memberof Message
     */
    markAsLiked(state?: boolean): Promise<boolean>;
    /**
     * Marks the message as seen
     * @return {Promise<void>}
     * @memberof Message
     */
    markAsSeen(): Promise<void>;
    /**
     * Marks the message as done
     * @param {boolean} [state=true] State to use (done/not done)
     * @return {Promise<boolean>}
     * @memberof Message
     */
    markAsDone(state?: boolean): Promise<boolean>;
    /**
     * Marks the message as starred
     * @param {boolean} [state=true] State to use (starred/not starred)
     * @return {Promise<boolean>}
     * @memberof Message
     */
    markAsStarred(state?: boolean): Promise<boolean>;
    /**
     * Refreshes message replies and some other fields
     * @param {RawDataObject} [data=null] Raw data to use instead of requesting from the server
     * @memberof Message
     */
    refresh(data?: RawDataObject): Promise<void>;
    /**
     * Searches for the user object from userstring. If user is not found, the parsed userstring is returned.
     * @private
     * @param {string} userString Userstring to search for
     * @return {{recipient: (User | Teacher | Student | Parent | Plan | Class), wildcard: boolean}} User object and wildcard flag
     * @memberof Message
     */
    private getRecipient;
}
declare namespace Message {
    export { RawDataObject };
}
import RawData = require("../lib/RawData");
import Edupage = require("./Edupage");
import User = require("./User");
import Teacher = require("./Teacher");
import Student = require("./Student");
import Parent = require("./Parent");
import Plan = require("./Plan");
import Class = require("./Class");
import Attachment = require("./Attachment");
import Assignment = require("./Assignment");
type RawDataObject = import("../lib/RawData").RawDataObject;
