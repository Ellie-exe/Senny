module.exports = {
    name: 'messageCreate',
    /** @param {import('discord.js/typings').Message} message */
    async execute(message) {
        try {
            if (message.channelId === '755904515080847493') {
                client.emit('countingChannelCheck');
            }

            if (message.channelId === '578219142742802462' && message.content === '!d bump') {
                client.emit('bumpReminder', message);
            }

        } catch (err) {
            logger.error(err);
        }
    }
};
