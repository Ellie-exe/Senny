const { logger } = require('../utils');
const axios = require("axios");

module.exports = {
    name: 'questionOfTheDay',

    /** @param {import('discord.js/typings').Client} client */
    async execute(client) {
        try {
            const channels = [];

            channels.push(client.channels.cache.get('755904698363674774'));
            channels.push(client.channels.cache.get('1062482192300785696'));

            const config = {
                headers: {
                    'X-RapidAPI-Key': '83218fae53msh4dce9cdb2fc8e7ep18c5ffjsn9acd49c28bee',
                    'X-RapidAPI-Host': 'conversation-starter1.p.rapidapi.com'
                }
            };

            axios.get('https://conversation-starter1.p.rapidapi.com/', config).then(res => {
                try {
                    for (const channel of channels) {
                        channel.send(`**${res.data.question}**`);
                    }

                } catch (err) {
                    logger.error(err.stack);
                }
            });

        } catch (err) {
            logger.error(err.stack);
        }
    }
};
