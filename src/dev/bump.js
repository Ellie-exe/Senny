const schedule = require('node-schedule');
const dateFormat = require('dateformat');
const mariadb = require('mariadb');

module.exports = {
    /**
     * Reminds a user to bump after 2 hours
     * @param {import('discord.js').Message} message
     * @param {import('../utils')} utils
     */
    async execute(message, utils) {
        try {
            const user = message.author;
            const channel = message.channel;
            const date = Date.now() + 7200000;
            const display = dateFormat(date, 'mmmm d, yyyy "at" h:MM TT Z');
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            const text = '!d bump';
            
            let reminderID = '';

            const conn = await mariadb.createConnection({
                user: process.env.user,
                password: process.env.password,
                database: process.env.database
            });

            for (let i = 0; i < 5; i++) {
                const num = Math.floor(Math.random() * chars.length);
                reminderID += chars.charAt(num);
            }

            const sql = 'INSERT INTO reminders VALUES (?, ?, ?, ?, ?)';
            await conn.query(sql, [reminderID, channel.id, user.id, date, text]);
                
            message.channel.send(`${utils.constants.emojis.greenTick} __**Reminder set!**__ - \`${display}\`\n\`\`\`${text}\`\`\``);

            schedule.scheduleJob(date, async () => {
                try {
                    const sql = 'SELECT reminderID FROM reminders WHERE reminderID=(?)';
                    const reminder = await conn.query(sql, [reminderID]);
                    if (reminder.length === 0) return;

                    await channel.send(`__**Reminder!**__ - ${user.toString()}\n\`\`\`${text}\`\`\``);

                    await conn.query('DELETE FROM reminders WHERE reminderID=(?)', [reminderID]);
                    await conn.end();

                } catch (err) {
                    utils.logger.error(err);
                }
            });

        } catch (err) {
            utils.logger.error(err);
        }
    }
}
