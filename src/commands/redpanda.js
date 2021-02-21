const { MessageEmbed } = require('discord.js');
const axios = require('axios');
/**
 * @param {import('../../types').Interaction} command
 */
module.exports.execute = async (command) => {
    try {
        const data = await axios.get('https://api.chewey-bot.top/red-panda?auth=2d3aca1f-e0dc-4d23-acea-049f926ed38d');
        const link = data.data.data;

        const embed = new MessageEmbed()
            .setAuthor('Red Panda', null, link)
            .setImage(link)
            .setColor(process.env.color);

        command.embed([embed]);

    } catch (err) {
        command.error(err);
    }
};
