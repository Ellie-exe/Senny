const schedule = require("node-schedule");
module.exports = {
    name: 'ready',
    async execute() {
        try {
            const schedule = require('node-schedule');

            client.emit('commandSync');

            const activity = [
                {type: 'LISTENING', name: '/'},
                {type: 'WATCHING', name: 'over Bongo'},
                {type: 'PLAYING', name: 'with the API'},
                {type: 'WATCHING', name: `${client.guilds.cache.size} Guilds`}
            ];

            let counter = 0;
            client.user.setActivity(activity[0].name, {type: activity[0].type});

            setInterval(async () => {
                (counter === 3) ? counter = 0 : counter++;
                client.user.setActivity(activity[counter].name, {type: activity[counter].type});

            }, 30000);

            const Reminders = sequelize.define('reminders', {
                reminderId: {type: DataTypes.STRING(10), primaryKey: true},
                authorId: DataTypes.STRING(20),
                channelId: DataTypes.STRING(20),
                userId: DataTypes.STRING(20),
                time: DataTypes.BIGINT({length: 20}),
                message: DataTypes.TEXT
            });

            const reminders = await Reminders.findAll();

            reminders.forEach(reminder => {
                schedule.scheduleJob(reminder.time, async () => {
                    try {
                        const user = client.users.cache.get(reminder.userId);
                        const channel = client.channels.cache.get(reminder.channelId) || await user?.createDM();

                        await reminder.destroy();

                        const data = JSON.stringify(reminder.toJSON(), null, 4);
                        if (!channel) throw new Error(`Reminder not sent: ${data}`);

                        await channel.send(reminder.message);

                    } catch (err) {
                        logger.error(err);
                    }
                });
            });

            const Birthdays = sequelize.define('birthdays', {
                userId: {type: DataTypes.STRING(20), primaryKey: true},
                timestamp: DataTypes.BIGINT({length: 20}),
                date: DataTypes.DATEONLY
            });

            const birthdays = await Birthdays.findAll();

            for (const birthday of birthdays) {
                schedule.scheduleJob(birthday.timestamp, async () => {
                    const channel = client.channels.cache.get('405147700825292827');
                    const user = client.users.cache.get(birthday.userId);

                    await channel.send(`It is ${user.toString()}'s birthday today!`);
                });
            }

            logger.info(`Ready to serve ${client.guilds.cache.reduce((users, guild) => users + guild.memberCount, 0)} users in ${client.guilds.cache.size} servers`);

        } catch (err) {
            logger.error(err);
        }
    }
};
