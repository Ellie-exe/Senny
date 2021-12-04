module.exports = {
    name: 'qotd',
    async execute() {
        try {
            const fs = require('fs');
            const questions = require('./questions');

            const channel = client.channels.cache.get('755904698363674774');

            const question = questions[Math.floor(Math.random() * questions.length)];
            channel.send(`**${question}**`);

            fs.readFile('./src/events/questions.js', 'utf-8', (err, data) => {
                if (err) throw err;

                const newData = data.replace(`\n    "${question}",`, '');

                fs.writeFile('./src/events/questions.js', newData, 'utf-8', (err) => {
                    if (err) throw err;
                });
            });

        } catch (err) {
            logger.error(err);
        }
    }
};
