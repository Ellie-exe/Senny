const schedule = require('node-schedule');
module.exports = {
    name: 'bump',
    /** @param {import('discord.js/typings').Message} message */
    async execute(message) {
        try {
            /** @param {int} length */
            const newId = (length) => {
                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                let reminderId = '';

                for (let i = 0; i < length; i++) {
                    reminderId += chars.charAt(Math.floor(Math.random() * chars.length));
                }

                return reminderId;
            }

            const Reminders = sequelize.define('reminders', {
                reminderId: {type: DataTypes.STRING(10), primaryKey: true},
                authorId: DataTypes.STRING(20),
                channelId: DataTypes.STRING(20),
                userId: DataTypes.STRING(20),
                time: DataTypes.BIGINT({length: 20}),
                message: DataTypes.TEXT
            });

            const reminderId = newId(5);
            const timestamp = Date.now() + 7200000;
            const now = `<t:${Math.round(Date.now() / 1000)}:R>`;
            const end = `<t:${Math.round(timestamp / 1000)}:R>`;
            const channel = client.channels.cache.get('578219142742802462');

            await Reminders.create({
                reminderId: reminderId,
                authorId: message.author.id,
                channelId: channel.id,
                userId: undefined,
                time: timestamp,
                message: `Hello! ${message.author.toString()} asked me to remind ${channel.toString()} about **"bump"** ${now}`
            });

            schedule.scheduleJob(timestamp, async () => {
                try {
                    const reminder = await Reminders.findOne({where: {reminderId: reminderId}});

                    if (reminder) {
                        const user = client.users.cache.get(reminder.userId);
                        const channel = client.channels.cache.get(reminder.channelId) || await user?.createDM();

                        await reminder.destroy();

                        const data = JSON.stringify(reminder.toJSON(), null, 4);
                        if (!channel) throw new Error(`Reminder not sent: ${data}`);

                        await channel.send(reminder.message);
                    }

                } catch (err) {
                    logger.error(err);
                }
            });

            await message.reply(`Okay ${message.author.toString()}! I'll remind ${channel.toString()} about **"bump"** ${end}`);

        } catch (err) {
            logger.error(err);
        }
    }
};
