const schedule = require('node-schedule');
const mariadb = require('mariadb');
/**
 * @param {import('../../types').Client} client
 * @param {import('../../types').Utils} utils
 */
module.exports = async (client, utils) => {
    try {
        const conn = await mariadb.createConnection({
            user: process.env.user,
            password: process.env.password,
            database: process.env.database
        });

        const reminders = await conn.query('SELECT * FROM reminders');

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

                    await conn.end();

                } catch (err) {
                    utils.logger.error(err);
                }
            });
        });

    } catch (err) {
        utils.logger.error(err);
    }
}
