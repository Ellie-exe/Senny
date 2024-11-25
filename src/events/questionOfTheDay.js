const { questions, logger } = require('../utils');
const axios = require("axios");

module.exports = {
    name: 'questionOfTheDay',

    /**
     * @param {import('discord.js/typings').Client} client
     * @param message
     */
    async execute(client, message) {
        try {
            const channels = [];

            channels.push(client.channels.cache.get('755904698363674774'));
            channels.push(client.channels.cache.get('1062482192300785696'));
            channels.push(client.channels.cache.get('1294774519348723812'));
            channels.push(client.channels.cache.get('1308239803459960883'));

            const question = await questions.findOneAndDelete().sort({ timestamp: 'asc' }).exec();
            const msg = message === null ? '' : `Note: ${message}. `;

            if (question) {
                const author = await client.users.fetch(question.authorId);

                for (const channel of channels) {
                    channel.send(`# ${question.question}\n*${msg}Source: ${author.toString()} - <t:${Math.floor(question.timestamp / 1000)}:D>*`);
                }

                return;
            }

            const config = {
                headers: {
                    'X-RapidAPI-Key': '83218fae53msh4dce9cdb2fc8e7ep18c5ffjsn9acd49c28bee',
                    'X-RapidAPI-Host': 'conversation-starter1.p.rapidapi.com'
                }
            };

            axios.get('https://conversation-starter1.p.rapidapi.com/', config).then(res => {
                try {
                    for (const channel of channels) {
                        channel.send(`# ${res.data.question}\n*${msg}Source: API - <t:${Math.floor(Date.now() / 1000)}:D>*`);
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
