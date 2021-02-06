const schedule = require('node-schedule');
const Enmap = require('enmap');

module.exports = async (client, utils) => {
    try {
        const enmap = new Enmap({name: 'reminders'});

        const indexes = enmap.indexes;

        for (const index in indexes) {
            const key = indexes[index];
            const channel = client.channels.cache.get(enmap.get(key, 'channelID'));
            const author = await client.users.fetch(enmap.get(key, 'authorID'));
            const text = enmap.get(key, 'text');
            const date = enmap.get(key, 'date');

            schedule.scheduleJob(date, async () => {
                try {
                    if (enmap.indexes.includes(key)) {
                        await channel.send(`Hello ${author.toString()}! You asked me to remind you about: \`${text}\``);
                        enmap.delete(key);
                    }
                
                } catch (err) {
                    channel.send(`${utils.constants.emojis.redX} Error: \`${err}\``).catch(err => utils.logger.error(err));
                    utils.logger.error(err);
                }
            });
        }

    } catch (err) {
        utils.logger.error(err);
    }
}