const debug = require("debug")("edupage:log");
const error = require("debug")("edupage:error");
const {APIError, EdupageError, ParseError} = require("./exceptions");
const RawData = require("../lib/RawData");
const Edupage = require("./Edupage");
const {ENDPOINT, API_STATUS} = require("./enums");

debug.log = console.log.bind(console);


/**
 * @typedef {import("../lib/RawData").RawDataObject} RawDataObject
 */

/**
 * @typedef {import("./enums").EntityType} EntityType
 */

/**
 * @experimental
 * @class Application
 * @extends {RawData}
 */
class Application extends RawData {
	/**
	 * Creates an instance of Grade.
	 * @param {RawDataObject} [data={}]
	 * @param {Edupage} [edupage=null]
	 * @memberof Grade
	 */
	constructor(data = {}, edupage = null) {
		super(data);

		/**
		 * @type {Edupage}
		 */
		this.edupage = edupage;

		/**
		 * @type {string}
		 */
		this.id = data.id;

		/**
		 * @type {Date}
		 */
		this.dateFrom = data.datefrom ? new Date(data.datefrom) : null;

		/**
		 * @type {Date}
		 */
		this.dateTo = data.dateto ? new Date(data.dateto) : null;

		/**
		 * @type {string}
		 */
		this.name = data.name;

		/**
		 * Contains array of parameter names to be provided to `Application.post(...)` call (e.g. date, price...)
		 * @type {string[]}
		 */
		this.parameters = data.dataColumns;

		/**
		 * @type {EntityType}
		 */
		this.availableFor = data.user;

		/**
		 * @type {boolean}
		 */
		this.isEnabled = data.enabled;

		/**
		 * @type {boolean}
		 */
		this.isTextOptional = data.textOptional || false;

		/**
		 * @type {boolean}
		 */
		this.isAdvancedWorkflow = data.isAdvancedWorkflow || false;

		/**
		 * @type {boolean}
		 */
		this.isSimpleWorkflow = data.isSimpleWorkflow || false;

		if(this.edupage) Application.prototype.init.call(this);
	}

	/**
	 * Creates Application draft
	 * @return {Promise<string>} draft id 
	 * @memberof Application
	 */
	async createDraft() {
		if(!this.edupage) throw new EdupageError(`Application does not have assigned Edupage instance yet`);

		const res = await this.edupage.api({
			url: ENDPOINT.TIMELINE_CREATE_ITEM,
			data: {
				typ: "process",
				selectedProcessType: this.id,
				selectedUser: this.edupage.user.getUserString(false)
			}
		});

		if(res.status !== API_STATUS.OK) {
			error(`Received invalid status from the server '${res.status}'`);
			throw new APIError(`Failed to create draft for the application: Invalid status received '${res.status}'`, res);
		}

		const draft = (res.redirect?.match(/draft=(\d+)/) || "")[1];

		if(!draft) {
			error(`Failed to parse draft id`, res.redirect);
			throw new ParseError(`Failed to parse draft id from redirect url`);
		}

		return draft;
	}

	/**
	 * Posts the application with input parameters
	 * @experimental
	 * @param {RawDataObject} [parameters={}] Object of parameters from `Application.parameters`
	 * @param {string} [draftId=null] Your custom created draft ID. If the paramater is not specified (or provided value is falsy), new draft is created internally.
	 * @return {Promise<boolean>} `true` if the method was successful, otherwise `false`
	 * @memberof Application
	 */
	async post(parameters = {}, draftId = null) {
		const res = await this.edupage.api({
			url: ENDPOINT.DASHBOARD_GCALL,
			method: "POST",
			type: "text",
			data: new URLSearchParams({
				gpid: draftId || await this.createDraft(),
				gsh: this.edupage.ASC.gsecHash,
				action: "create",
				_LJSL: "2052",	//Seems like some -static- (it might vary) parameter (Loaded JS Libraries), keep it for a safety
				...parameters
			}).toString(),
			encodeBody: false
		});

		const success = /"border_error":\s*false/.test(res) && !/"border_error":\s*true/.test(res);

		return success;
	}

	/**
	 * 
	 * @param {Edupage} [edupage=null]
	 * @memberof Application
	 */
	init(edupage = null) {
		if(edupage) this.edupage = edupage;
	}
}

module.exports = Application;