module.exports = {
    name: 'redpanda',
    async execute(command) {
        const axios = require('axios');

        const image = await axios.get('https://api.chewey-bot.top/red-panda?auth=2d3aca1f-e0dc-4d23-acea-049f926ed38d');
        const image_link = image.data.data;

        command.send(image_link);
    }
};