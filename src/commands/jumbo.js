module.exports = {
    /**
     * @param {import('../utils').Interaction} command
     * @param {import('../utils')} utils
     */
    async execute(command, utils) {
        try {
            const emojiID = command.data.options[0].value.match(/\d/g).join('');
            const emoji = command.client.emojis.cache.get(emojiID);

            if (emoji === undefined) throw new Error('I do not have access to that emoji');

            const embed = new utils.MessageEmbed()
                .setAuthor(`${emoji.name} - Jumbo`, null, emoji.url)
                .setImage(emoji.url)
                .setColor(process.env.color);

            await command.embed([embed]);

        } catch (err) {
            await command.error(err);
        }
    },

    data: {
        name: 'jumbo',
        description: 'Get an emoji\'s image',
        options: [
            {
                name: 'emote',
                description: 'Emote to get',
                required: true,
                type: 3
            }
        ]
    }
};
