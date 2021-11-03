module.exports = {
    /** @param {import('discord.js/typings').CommandInteraction} command */
    async execute(command) {
        try {
            const emojiID = command.options.getString('emoji').match(/(?<=:)\d+(?=>)/)[0];
            const emoji = command.client.emojis.cache.get(emojiID);

            if (emoji === undefined) await command.reply('Invalid emote');

            await command.reply(emoji.url);

        } catch (err) {
            logger.error(err);
        }
    },

    data: [
        {
            type: 'CHAT_INPUT',
            name: 'jumbo',
            description: 'Get an emoji\'s image',
            options: [
                {
                    type: 'STRING',
                    name: 'emoji',
                    description: 'The emoji to get an image from',
                    required: true
                }
            ]
        }
    ]
};
