module.exports = {
    name: 'ready',
    async execute() {
        try {
            const schedule = require('node-schedule');

            const activity = [
                {type: 'LISTENING', name: '/'},
                {type: 'WATCHING', name: 'over Bongo'},
                {type: 'PLAYING', name: 'with the API'},
                {type: 'WATCHING', name: `${client.guilds.cache.size} Guilds`}
            ];

            let counter = -1;
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

            const commands = await client.application.commands.fetch();

            client.commands.each(async cmd => {
                if (cmd.flags.developer) return;

                for (const data of cmd.data) {
                    const command = commands.find(c => c.name === data.name && c.type === data.type);

                    if (command === undefined) {
                        await client.application.commands.create(data);
                        logger.debug(`Created ${data.type} Command: ${data.name}`);

                    } else if (!command.equals(data)) {
                        await command.edit(data);
                        logger.debug(`Updated ${data.type} Command: ${data.name}`);
                    }
                }
            });

            commands.each(async command => {
                const data = client.commands.find(c => c.data.find(d => d.name === command.name && d.type === command.type));

                if (data === undefined) {
                    await command.delete();
                    logger.debug(`Deleted ${command.type} Command: ${command.name}`);
                }
            });

            logger.info(`Ready to serve ${client.guilds.cache.reduce((users, guild) => users + guild.memberCount, 0)} users in ${client.guilds.cache.size} servers`);

        } catch (err) {
            logger.error(err);
        }
    }
};
