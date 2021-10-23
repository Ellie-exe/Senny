const schedule = require('node-schedule');
/**
 * @param {import('discord.js').Client} client
 * @param {import('../utils')} utils
 * @param {import('redis').RedisClient} cache
 */
module.exports = async (client, utils, cache) => {
    try {
        let counter = -1;

        setInterval(async () => {
            (counter === 3) ? counter = 0 : counter++;

            const activity = [
                {type: 'LISTENING', name: '/'},
                {type: 'WATCHING', name: 'over Bongo'},
                {type: 'PLAYING', name: 'with the API'},
                {type: 'WATCHING', name: `${client.guilds.cache.array().length} Guilds`}
            ];

            client.user.setActivity(activity[counter].name, {type: activity[counter].type});

        }, 30000);

        const database = new utils.database();

        await database
            .select('*')
            .from('filters')
            .query(async (err, res) => {
                if (err) throw err;

                res.forEach(async (filter) => {
                    await cache.hmsetAsync(filter.guildID, 'regex', filter.regex);
                });
            });

        await database
            .select('*')
            .from('bumps')
            .query(async (err, res) => {
                if (err) throw err;

                res.forEach(async (bump) => {
                    await cache.hmsetAsync(bump.guildID, 'bump', true);
                });
            });

        await database
            .select('*')
            .from('reminders')
            .query(async (err, res) => {
                if (err) throw err;

                res.forEach(async (reminder) => {
                    const reminderID = reminder.reminderID;
                    const text = reminder.text;
                    const date = reminder.date;

                    const channel = await client.channels.fetch(reminder.channelID);
                    const user = await client.users.fetch(reminder.userID);
                    const mention = channel.type === 'dm' ? user.username : user.toString();

                    schedule.scheduleJob(date, async () => {
                        await database
                            .delete('reminders')
                            .where('reminderID', reminderID)
                            .query(async (err) => {
                                if (err) throw err;
                                await channel.send(`Hello ${mention}! You asked me to remind you about \`${text}\``);
                            
                            }).catch(async (err) => {utils.logger.error(err)});
                    });
                });
            });

        utils.logger.info(`Bot ready in ${client.guilds.cache.array().length} guilds`);

    } catch (err) {
        utils.logger.error(err);
    }
};
