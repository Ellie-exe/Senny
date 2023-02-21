const { Events, Message } = require('discord.js');
const { logger } = require('../utils');

module.exports = {
    name: Events.MessageCreate,

    /** @param {Message} message */
    async execute(message) {
        try {
            if (message.channel.id !== '755904515080847493') {
                return;
            }

            const messages = /** @type {import('discord.js').Collection} */ (await message.channel.messages.fetch({ limit: 2 }));

            const /** @type {import('discord.js').Message} */ newMessage = messages.first();
            const /** @type {import('discord.js').Message} */ oldMessage = messages.last();

            const newValue = parseInt(newMessage.content);
            const currentValue = parseInt(oldMessage.content);

            const notNumber = isNaN(newValue) || newMessage.content.match(/\D/g);
            const notSequential = newValue <= currentValue || newValue > currentValue + 1;

            if (notNumber || notSequential || newMessage.author === oldMessage.author) {
                await message.delete();
            }

        } catch (err) {
            logger.error(err.stack);
        }
    }
};
