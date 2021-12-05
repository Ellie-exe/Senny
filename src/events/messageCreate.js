module.exports = {
    name: 'messageCreate',
    /** @param {import('discord.js/typings').Message} message */
    async execute(message) {
        try {
            if (message.channelId === '755904515080847493') {
                client.emit('counter');
            }

            if (message.channelId === '578219142742802462' && message.content === '!d bump') {
                client.emit('bump', message);
            }

        } catch (err) {
            logger.error(err);
        }
    }
};
