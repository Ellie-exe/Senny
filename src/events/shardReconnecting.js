/**
 * Fires when the bot is reconnecting shards
 * @param {import('../../types').Utils} utils
 */
module.exports = async (utils) => {
    utils.logger.warn('Bot reconnecting');
};
