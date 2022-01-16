/**
 * @typedef {Object} MAppData
 * @prop {string} loggedUser
 * @prop {number} loggedChild
 * @prop {string} loggedUserName
 * @prop {string} lang
 * @prop {string} edupage
 * @prop {string} school_type
 * @prop {number} timezonediff
 * @prop {string} school_country
 * @prop {string} schoolyear_turnover
 * @prop {number} firstDayOfWeek
 * @prop {string} sort_name_col
 * @prop {number} selectedYear
 * @prop {number} autoYear
 * @prop {string} year_turnover
 * @prop {boolean[]} vyucovacieDni
 * @prop {string} server
 * @prop {number} syncIntervalMultiplier
 * @prop {any} ascspl
 * @prop {boolean} jePro
 * @prop {boolean} jeZUS
 * @prop {boolean} rtl
 * @prop {boolean} rtlAvailable
 * @prop {string} uidsgn
 * @prop {boolean} webpageadmin
 * @prop {EduRequestProps} edurequestProps
 * @prop {string} gsechash
 * @prop {string} email
 * @prop {any[]} userrights
 * @prop {boolean} isAdult
 */

/**
 * @typedef {Object} EduRequestProps
 * @prop {string} edupage
 * @prop {string} lang
 * @prop {string} school_name
 * @prop {string} school_country
 * @prop {string} school_state
 * @prop {string} schoolyear_turnover
 * @prop {any[]} custom_turnover
 * @prop {number} firstDayOfWeek
 * @prop {number[]} weekendDays
 * @prop {string} timezone
 * @prop {string} sort_name_col
 * @prop {{date: string, time: string}} dtFormats
 * @prop {string} jsmodulemode
 * @prop {string} loggedUser
 * @prop {any[]} loggedUserRights
 * @prop {boolean} isAsc
 * @prop {boolean} isAgenda
 */

/**
 * @typedef {Object} MAuthUser
 * @prop {string} userid
 * @prop {string} typ
 * @prop {string} edupage
 * @prop {string} edumeno
 * @prop {string} eduheslo
 * @prop {string} firstname
 * @prop {string} lastname
 * @prop {string} esid
 * @prop {MAppData} appdata
 * @prop {string} portal_userid
 * @prop {string} portal_email
 * @prop {"1" | null} need2fa
 */

/**
 * @typedef {Object} MAuthResponse
 * @prop {MAuthUser[]} users
 * @prop {boolean} needEdupage
 * @prop {string} edid
 * @prop {any | undefined} [t2fasec=undefined]
 */

//Required to enable type checking
module.exports = undefined;