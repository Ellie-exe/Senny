module.exports = {
    name: 'questionOfTheDay',
    async execute() {
        try {
            const axios = require("axios");
            const channels = [];

            channels.push(client.channels.cache.get('755904698363674774'));
            channels.push(client.channels.cache.get('1062482192300785696'));

            const options = {
                method: 'GET',
                url: 'https://conversation-starter1.p.rapidapi.com/',
                headers: {
                    'X-RapidAPI-Key': '83218fae53msh4dce9cdb2fc8e7ep18c5ffjsn9acd49c28bee',
                    'X-RapidAPI-Host': 'conversation-starter1.p.rapidapi.com'
                }
            };

            axios.request(options).then(res => {
                for (const channel of channels) {
                    channel.send(`**${res.data.question}**`);
                }
            });

        } catch (err) {
            logger.error(err);
        }
    }
};
