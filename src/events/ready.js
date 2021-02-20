const schedule = require('node-schedule');
const mariadb = require('mariadb');
/**
 * @param {import('../../types').Client} client
 * @param {import('../../types').Utils} utils
 * @param {import('../../types').Cache} cache
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

        const conn = await mariadb.createConnection({
            user: process.env.user,
            password: process.env.password,
            database: process.env.database
        });

        const reminders = await conn.query('SELECT * FROM reminders');
        const filters = await conn.query('SELECT * FROM filters');
        const bumps = await conn.query('SELECT * FROM bumpReminders');

        reminders.forEach(async reminder => {
            const reminderID = reminder.reminderID;
            const channel = await client.channels.fetch(reminder.channelID);
            const user = await client.users.fetch(reminder.userID);
            const text = reminder.text;
            const date = reminder.date;

            schedule.scheduleJob(date, async () => {
                try {
                    const reminder = await conn.query('SELECT reminderID FROM reminders WHERE reminderID=(?)', [reminderID]);
                    if (reminder.length === 0) return;

                    await channel.send(`Hello ${user.toString()}! You asked me to remind you about: \`${text}\``);
                    await conn.query('DELETE FROM reminders WHERE reminderID=(?)', [reminderID]);

                } catch (err) {
                    utils.logger.error(err);
                }
            });
        });

        filters.forEach(async regex => {
            cache.filter.set(regex.guildID, regex.regex);
        });

        bumps.forEach(async bump => {
            cache.bump.set(bump.guildID, true);
        })

        await conn.end();
        utils.logger.info(`Bot ready in ${client.guilds.cache.array().length} guilds`);

    } catch (err) {
        utils.logger.error(err);
    }
}
