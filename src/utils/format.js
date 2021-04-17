const moment = require('moment');

/**
 * @param {Date} date 
 * @returns {String}
 */
module.exports = (date) => {
    try {
        return moment(date).tz(moment.tz.guess()).format('LLL z');

    } catch (err) {
        utils.logger.error(err);
    }
};
