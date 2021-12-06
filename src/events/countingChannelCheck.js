module.exports = {
    name: 'countingChannelCheck',
    /** @param {import('discord.js/typings').Message} message */
    async execute(message) {
        try {
            const messages = await message.channel.messages.fetch({ limit: 2 });

            const newMessage = messages.first();
            const oldMessage = messages.last();

            const newValue = parseInt(newMessage.content);
            const currentValue = parseInt(oldMessage.content);

            if (isNaN(newValue) || newMessage.content.match(/\D/g) || newValue <= currentValue || newValue > currentValue + 1 || newMessage.author === oldMessage.author) {
                await message.delete();
            }

        } catch (err) {
            logger.error(err);
        }
    }
};
