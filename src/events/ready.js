const { Events, REST, Routes, ActivityType } = require('discord.js');
const { scheduleJob } = require("node-schedule");
const { reminders, birthdays, logger } = require('../utils');
const { cli } = require('winston/lib/winston/config');

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

            const globalCommands = [];
            const guildCommands = [];

            for (const command of require('../commands')) {
                if (command.guild !== null) {
                    const guild = guildCommands.find(c => c.guildId === command.guild);

                    if (guild) {
                        guild.commands.push(command.data.toJSON());
                        continue;
                    }

                    guildCommands.push({ guildId: command.guild, commands: [command.data.toJSON()] });
                    continue;
                }

                const data = command.data.toJSON();
                // data['integration_types'] = [0, 1];
                // data['contexts'] = [0, 1, 2];
                globalCommands.push(data);
            }

            const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

            if (process.env.NODE_ENV === 'production') {
                await rest.put(Routes.applicationCommands(client.user.id), { body: globalCommands });

                for (const guild of guildCommands) {
                    await rest.put(Routes.applicationGuildCommands(client.user.id, guild.guildId), { body: guild.commands });
                }

            } else {
                await rest.put(Routes.applicationGuildCommands(client.user.id, '660745210556448781'), { body: globalCommands });
                await rest.put(Routes.applicationGuildCommands(client.user.id, '573272766149558272'), { body: globalCommands });
                await rest.put(Routes.applicationGuildCommands(client.user.id, '396523509871935489'), { body: globalCommands });
            }

            const userCount = client.guilds.cache.reduce((users, guild) => users + guild.memberCount, 0);
            logger.info(`Ready to serve ${userCount} users in ${client.guilds.cache.size} servers! Logged in as ${client.user.tag}`);

        } catch (err) {
            logger.error(err.stack);
        }
    }
};
