const schedule = require('node-schedule');
const dateFormat = require('dateformat');
const mariadb = require('mariadb');
/**
 * @param {import('../../types').Message} message
 * @param {import('../../types').Utils} utils
 */
module.exports.execute = async (message, utils) => {
    try {
        const conn = await mariadb.createConnection({
            user: process.env.user,
            password: process.env.password,
            database: process.env.database
        });

        const user = message.author;
        const channel = message.channel;
        const date = Date.now() + 7200000;
        const displayDate = dateFormat(date, 'mmmm d, yyyy "at" h:MM TT Z');
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const text = '!d bump';

        let reminderID = '';
        for (let i = 0; i < 5; i++) reminderID += characters.charAt(Math.floor(Math.random() * characters.length));

        await conn.query('INSERT INTO reminders VALUES (?, ?, ?, ?, ?)', [reminderID, user.id, channel.id, date, text]);
        await message.channel.send(`Okay, I'll remind ${channel} about: \`!d bump\` at: \`${displayDate}\``);

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

    } catch (err) {
        message.channel.send(`${utils.constants.emojis.redX} ${err.name}: \`${err.message}\``).catch(err => utils.logger.error(err));
        utils.logger.error(err);
    }
}
