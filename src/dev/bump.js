const schedule = require('node-schedule');
const dateFormat = require('dateformat');

module.exports = {
    /**
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

            const database = new utils.database();

            for (let i = 0; i < 5; i++) {
                const num = Math.floor(Math.random() * chars.length);
                reminderID += chars.charAt(num);
            }

            await database
                .insert('reminders')
                .values(reminderID, channel.id, user.id, date, text)
                .query(async (err) => {
                    if (err) await database.error(err);
                    await channel.send(`Okay! I'll remind you here about \`${text}\` at \`${display}\``);
                });

            schedule.scheduleJob(date, async () => {
                await database
                    .select('reminderID')
                    .from('reminders')
                    .where('reminderID', reminderID)
                    .query(async (err, res) => {
                        if (err) throw err;
                        if (res.length === 0) return;

                        await database
                            .delete('reminders')
                            .where('reminderID', reminderID)
                            .query(async (err) => {
                                if (err) throw err;
                                await channel.send(`Hello ${user.toString()}! You asked me to remind you about \`${text}\``);
                            });
                    });
            });

        } catch (err) {
            utils.logger.error(err);
        }
    }
}
