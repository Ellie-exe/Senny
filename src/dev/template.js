module.exports = {
    /**
     * Command description here
     * @param {import('discord.js').Message} message
     * @param {string[]} args
     * @param {import('../utils')} utils
     */
    async execute(message, args, utils) {
        try {
            // Code here

        } catch (err) {
            // Send and log any errors
            message.channel.send(err, {code: 'xl', split: true}).catch(err => utils.logger.error(err));
            utils.logger.error(err);
        }
    }
};
