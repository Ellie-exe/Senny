const { MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = {
    /**
     * Sends a cute red panda image
     * @param {import('../utils').Interaction} command
     */
    async execute(command) {
        try {
            // Get the link data
            const data = await axios.get('https://api.chewey-bot.top/red-panda?auth=2d3aca1f-e0dc-4d23-acea-049f926ed38d');
            const link = data.data.data;

            // Create the embed
            const embed = new MessageEmbed()
                .setAuthor('Red Panda', null, link)
                .setImage(link)
                .setColor(process.env.color);

            // Send the embed
            command.embed([embed]);

        } catch (err) {
            // Log any errors
            command.error(err);
        }
    },

    // The data to register the command
    json: {
        name: 'redpanda',
        description: 'Get a random red panda image'
    }
};
