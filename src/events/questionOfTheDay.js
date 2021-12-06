module.exports = {
    name: 'questionOfTheDay',
    async execute() {
        try {
            const fs = require('fs');
            const channel = client.channels.cache.get('755904698363674774');

            fs.readFile('./questionOfTheDay.json', 'utf-8', (err, data) => {
                if (err) throw err;

                const json = JSON.parse(data);
                const rand = Math.floor(Math.random() * json.questions.length);

                channel.send(`**${json.questions[rand]}**`);

                json.questions.splice(rand, 1);
                const newData = JSON.stringify(json, null, 4);

                fs.writeFile('./questionOfTheDay.json', newData, 'utf-8', (err) => {
                    if (err) throw err;
                });
            });

        } catch (err) {
            logger.error(err);
        }
    }
};
