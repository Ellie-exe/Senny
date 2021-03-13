/**
 * Command description here
 * @param {import('../utils').Interaction} command
 * @param {import('../utils')} utils
 */
module.exports.execute = async (command, utils) => {
    try {
        // Code here

    } catch (err) {
        // Log any errors
        command.error(err);
    }
};

/**
 * Command description here
 * @param {import('discord.js').Message} message
 * @param {string[]} args
 * @param {import('../utils')} utils
 */
module.exports.execute = async (message, args, utils) => {
    try {
        // Code here

    } catch (err) {
        // Send and log any errors
        message.channel.send(err, {code: 'xl', split: true}).catch(err => utils.logger.error(err));
        utils.logger.error(err);
    }
};
