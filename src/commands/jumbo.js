const { MessageEmbed } = require('discord.js');
/**
 * Sends an emoji's image
 * @param {import('../../types').Interaction} command
 */
module.exports.execute = async (command) => {
    try {
        // Get the emoji
        const emojiID = command.data.options[0].value.match(/\d/g).join('');
        const emoji = command.client.emojis.cache.get(emojiID);

        // If the emoji is from a guild the bot is not in
        if (emoji === undefined) throw new Error('I do not have access to that emoji');

        // Create the embed
        const embed = new MessageEmbed()
            .setAuthor(`${emoji.name} - Jumbo`, null, emoji.url)
            .setImage(emoji.url)
            .setColor(process.env.color);

        // Send the embed
        command.embed([embed]);

    } catch (err) {
        // Log any errors
        command.error(err);
    }
};
