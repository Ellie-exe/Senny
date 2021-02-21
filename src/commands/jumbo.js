const { MessageEmbed } = require('discord.js');
/**
 * @param {import('../../types').Interaction} command
 */
module.exports.execute = async (command) => {
    try {
        const args = command.data.options[0].value;
        const emojiID = args.match(/\d/g).join('');
        const emoji = command.client.emojis.cache.get(emojiID);

        if (emoji === undefined) throw new Error('I do not have access to that emoji');

        const embed = new MessageEmbed()
            .setAuthor(`${emoji.name} - Jumbo`, null, emoji.url)
            .setImage(emoji.url)
            .setColor(process.env.color);

        command.embed([embed]);

    } catch (err) {
        command.error(err);
    }
};
