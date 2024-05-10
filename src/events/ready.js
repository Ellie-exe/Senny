const { Events, REST, Routes, ActivityType } = require('discord.js');
const { scheduleJob } = require("node-schedule");
const { reminders, birthdays, logger } = require('../utils');

module.exports = {
    name: Events.ClientReady,

    /** @param {import('discord.js').Client} client */
    async execute(client) {
        try {
            const activities = [
                { type: ActivityType.Watching, name: `${client.guilds.cache.reduce((users, guild) => users + guild.memberCount, 0)} users` },
                { type: ActivityType.Watching, name: `${client.guilds.cache.size} servers` }
            ];

            client.user.setActivity(activities[0].name, { type: activities[0].type });
            let counter = 0;

            setInterval(async () => {
                try {
                    counter === activities.length - 1 ? counter = 0 : counter++;
                    client.user.setActivity(activities[counter].name, {type: activities[counter].type});

                } catch (err) {
                    logger.error(err.stack);
                }

            }, 30000);

            const reminderList = await reminders.find().exec();
            const birthdayList = await birthdays.find().exec();

            for (const reminder of reminderList) {
                scheduleJob(reminder.endTimestamp, async () => {
                    try {
                        const channel = /** @type {import('discord.js').TextChannel} */ (await client.channels.fetch(/** @type {String} */ reminder.destinationId));

                        const message = `Hello! ${reminder.authorString} asked me to remind ${reminder.destinationString} ` +
                            `about **"${reminder.message}"** <t:${Math.round(reminder.startTimestamp / 1000)}:R>`;

                        await channel.send(message);
                        await reminder.delete();

                    } catch (err) {
                        logger.error(err.stack);
                    }
                });
            }

            for (const birthday of birthdayList) {
                scheduleJob(`0 0 ${birthday.day} ${birthday.month} *`, async () => {
                    try {
                        const channel = /** @type {import('discord.js').TextChannel} */ (client.channels.cache.get('405147700825292827'));
                        const user = await client.users.fetch(/** @type {String} */ birthday.userId);

                        await channel.send(`Hello <@&396534463489769475>! Today is ${user.toString()}'s birthday today!`);

                    } catch (err) {
                        logger.error(err.stack);
                    }
                });
            }

            const commands = [];
            const guildCommands = [];

            for (const command of require('../commands')) {
                if (command.data.toJSON().guildId !== 'global') { guildCommands.push(command.data.toJSON()); continue; }
                commands.push(command.data.toJSON());
            }

            const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

            if (process.env.NODE_ENV === 'production') {
                await rest.put(Routes.applicationCommands('665318329040371725'), { body: commands });
                await rest.put(Routes.applicationGuildCommands(client.user.id, '396523509871935489'), { body: guildCommands });

            } else {
                await rest.put(Routes.applicationGuildCommands(client.user.id, '660745210556448781'), { body: commands });
                await rest.put(Routes.applicationGuildCommands(client.user.id, '573272766149558272'), { body: commands });
                await rest.put(Routes.applicationGuildCommands(client.user.id, '396523509871935489'), { body: commands });
            }

            const userCount = client.guilds.cache.reduce((users, guild) => users + guild.memberCount, 0);
            logger.info(`Ready to serve ${userCount} users in ${client.guilds.cache.size} servers! Logged in as ${client.user.tag}`);

        } catch (err) {
            logger.error(err.stack);
        }
    }
};
