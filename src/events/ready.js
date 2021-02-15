const schedule = require('node-schedule');
const Enmap = require('enmap');
/**
 * @param {import('../../types').Client} client 
 * @param {import('../../types').Utils} utils 
 */
module.exports = async (client, utils) => {
    try {
        const reminder = new Enmap({name: 'reminder'});

        const indexes = reminder.indexes;

        for (const index in indexes) {
            const reminderID = indexes[index];
            const channel = client.channels.cache.get(reminder.get(reminderID, 'channelID'));
            const author = await client.users.fetch(reminder.get(reminderID, 'authorID'));
            const text = reminder.get(reminderID, 'text');
            const date = reminder.get(reminderID, 'date');

            schedule.scheduleJob(date, async () => {
                try {
                    if (reminder.indexes.includes(reminderID)) {
                        await channel.send(`Hello ${author.toString()}! You asked me to remind you about: \`${text}\``);
                        reminder.delete(reminderID);
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