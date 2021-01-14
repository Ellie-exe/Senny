const axios = require('axios');

module.exports = {
    name: 'redpanda',
    async execute(i) {
        const image = await axios.get('https://api.chewey-bot.top/red-panda?auth=2d3aca1f-e0dc-4d23-acea-049f926ed38d');
        i.send(image.data.data);
    }
};