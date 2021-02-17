/**
 * @param {import('../../types').Interaction} command
 * @param {import('../../types').Utils} utils
 */
module.exports.execute = async (command, utils) => {
    try {
        const test = true;

    } catch (err) {
        command.send(`${utils.constants.emojis.redX} ${err.name}: \`${err.message}\``, {typs: 3, flags: 64});
        utils.logger.error(err);
    }
};

/**
 * @param {import('../../types').Message} message
 * @param {import('../../types').Utils} utils
 */
module.exports.execute = async (message, args, utils) => {
    try {


    } catch (err) {
        message.channel.send(`${utils.constants.emojis.redX} ${err.name}: \`${err.message}\``).catch(err => utils.logger.error(err));
        utils.logger.error(err);
    }
};
