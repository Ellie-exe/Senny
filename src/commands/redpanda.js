const axios = require('axios');

module.exports = {
    /**
     * @param {import('../utils').Interaction} command
     * @param {import('../utils')} utils
     */
    async execute(command, utils) {
        try {
            const data = await axios.get('https://api.chewey-bot.top/red-panda?auth=2d3aca1f-e0dc-4d23-acea-049f926ed38d');
            const link = data.data.data;

            const embed = new utils.MessageEmbed()
                .setAuthor('Red Panda', null, link)
                .setImage(link)
                .setColor(process.env.color);

            await command.embed([embed]);

        } catch (err) {
            await command.error(err);
        }
    },

    data: {
        name: 'redpanda',
        description: 'Get a red panda image'
    }
};
