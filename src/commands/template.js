/**
 * @param {import('../../types').Interaction} command
 * @param {import('../../types').Utils} utils
 */
module.exports.execute = async (command, utils) => {
    try {


    } catch (err) {
        command.error(err);
    }
};

/**
 * @param {import('../../types').Message} message
 * @param {import('../../types').Utils} utils
 */
module.exports.execute = async (message, args, utils) => {
    try {


    } catch (err) {
        message.channel.send(err, {code: 'xl', split: true}).catch(err => utils.logger.error(err));
        utils.logger.error(err);
    }
};
