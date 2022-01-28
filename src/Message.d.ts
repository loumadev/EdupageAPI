export = Message;
/**
 * @typedef {import("../lib/RawData").RawDataObject} RawDataObject
 */
declare class Message extends RawData {
    /**
     *
     * @static
     * @param {string} name
     * @return {{firstname: string, lastname: string}}
     * @memberof Message
     */
    static parseUsername(name: string): {
        firstname: string;
        lastname: string;
    };
    /**
     * Creates an instance of Message.
     * @param {RawDataObject} [data={}]
     * @param {Edupage} [edupage=null]
     * @memberof Message
     */
    constructor(data?: RawDataObject, edupage?: Edupage);
    /**
     * @type {Edupage}
     */
    edupage: Edupage;
    /**
     * @type {string}
     */
    id: string;
    /**
     * @type {string}
     */
    type: string;
    /**
     * @type {Date}
     */
    creationDate: Date;
    /**
     * @type {Date}
     */
    timelineDate: Date;
    /**
     * @type {string}
     */
    otherId: string;
    /**
     * @type {number}
     */
    repliesCount: number;
    /**
     * @type {Date}
     */
    lastReplyDate: Date;
    /**
     * @type {boolean}
     */
    isRemoved: boolean;
    /**
     * @type {boolean}
     */
    isReply: boolean;
    /**
     * @type {boolean}
     */
    isImportant: boolean;
    /**
     * @type {Date}
     */
    seenDate: Date;
    /**
     * @type {boolean}
     */
    isSeen: boolean;
    /**
     * @type {Date}
     */
    likedDate: Date;
    /**
     * @type {boolean}
     */
    isLiked: boolean;
    /**
     * @type {Date}
     */
    doneDate: Date;
    /**
     * @type {boolean}
     */
    isDone: boolean;
    /**
     * @type {boolean}
     */
    isStarred: boolean;
    /**
     * @type {number}
     */
    likes: number;
    /**
     * @type {string}
     */
    text: string;
    /**
     * @type {string}
     */
    title: string;
    /**
     * ! WARNING: This property is only accessible after calling `message.refresh()`!
     * @type {number}
     */
    participantsCount: number;
    /**
     * ! WARNING: This property is only accessible after calling `message.refresh()`!
     * @type {(User|Teacher|Student|Parent)[]}
     */
    participants: (User | Teacher | Student | Parent)[];
    /**
     * ! WARNING: This property is only accessible after calling `message.refresh()`!
     * @type {({user: User|Teacher|Student|Parent, date: Date})[]}
     */
    likedBy: {
        user: User | Teacher | Student | Parent;
        date: Date;
    }[];
    /**
     * ! WARNING: This property is only accessible after calling `message.refresh()`!
     * @type {({user: User|Teacher|Student|Parent, date: Date})[]}
     */
    seenBy: {
        user: User | Teacher | Student | Parent;
        date: Date;
    }[];
    /**
     * @type {User|Teacher|Student|Parent}
     */
    owner: User | Teacher | Student | Parent;
    /**
     * @type {User|Teacher|Student|Parent|Plan|Class}
     */
    recipient: User | Teacher | Student | Parent | Plan | Class;
    /**
     * @type {string}
     */
    recipientUserString: string;
    /**
     * @type {boolean}
     */
    isWildcardRecipient: boolean;
    /**
     * @type {Message}
     */
    replyOf: Message;
    /**
     * @type {Attachment[]}
     */
    attachments: Attachment[];
    /**
     * @type {Message[]}
     */
    replies: Message[];
    /**
     * @type {Assignment}
     */
    assignment: Assignment;
    /**
     *
     * @param {Edupage} [edupage=null]
     * @memberof Message
     */
    init(edupage?: Edupage): void;
    /**
     * @typedef {Object} MessageReplyOptions
     * @prop {string} text
     * @prop {User|Teacher|Student|Parent} [recipient=null]
     * @prop {boolean} [parents=false]
     * @prop {Attachment[]} [attachments=[]]
     */
    /**
     *
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
     *
     * @param {boolean} [state=true]
     * @return {Promise<boolean>}
     * @memberof Message
     */
    markAsLiked(state?: boolean): Promise<boolean>;
    /**
     *
     * @return {Promise<void>}
     * @memberof Message
     */
    markAsSeen(): Promise<void>;
    /**
     *
     * @param {boolean} [state=true]
     * @return {Promise<boolean>}
     * @memberof Message
     */
    markAsDone(state?: boolean): Promise<boolean>;
    /**
     *
     * @param {boolean} [state=true]
     * @return {Promise<boolean>}
     * @memberof Message
     */
    markAsStarred(state?: boolean): Promise<boolean>;
    /**
     *
     * @param {RawDataObject} [data=null]
     * @memberof Message
     */
    refresh(data?: RawDataObject): Promise<void>;
    /**
     *
     * @private
     * @param {string} userString
     * @return {{recipient: (User | Teacher | Student | Parent | Plan | Class), wildcard: boolean}}
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
type RawDataObject = {
    [x: string]: any;
};
