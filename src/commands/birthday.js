module.exports = {
    /** @param {import('discord.js/typings').CommandInteraction} command */
    async execute(command) {
        try {
            const schedule = require('node-schedule');
            await command.deferReply();

            const Birthdays = sequelize.define('birthdays', {
                userId: {type: DataTypes.STRING(20), primaryKey: true},
                timestamp: DataTypes.BIGINT({length: 20}),
                date: DataTypes.DATEONLY
            });

            await Birthdays.sync();

            const getTimeMarkdown = (date) => {
                const timestamp = Date.parse(date);

                let displayDate = `${date}`;
                if (!isNaN(timestamp)) {
                    displayDate = `<t:${timestamp / 1000}:D>`;
                }

                return displayDate;
            }

            const subcommand = command.options.getSubcommand();

            switch (subcommand) {
                case 'set': {
                    const user = command.options.getUser('user');
                    const month = command.options.getString('month');
                    const day = command.options.getInteger('day');
                    const year = command.options.getInteger('year');
                    const timezone = command.options.getString('timezone').toUpperCase();

                    const monthDay = `${month}-${day} ${timezone}`;
                    const date = `${year}-${monthDay}`;
                    const displayDate = getTimeMarkdown(date);

                    const currentYear = new Date().getFullYear();

                    let next = `${currentYear}-${monthDay}`;
                    if (Date.parse(next) < Date.now()) next = `${currentYear + 1}-${monthDay}`;

                    const timestamp = Date.parse(next);
                    if (isNaN(timestamp)) return await command.editReply('Invalid date');

                    const birthday = await Birthdays.findOne({where: {userId: user.id}});
                    if (birthday) {
                        await command.editReply(`${user.toString()} already has a birthday set`);
                        break;
                    }

                    await Birthdays.create({
                        userId: user.id,
                        timestamp: timestamp,
                        date: date
                    });

                    schedule.scheduleJob(timestamp, async () => {
                        const birthday = await Birthdays.findOne({where: {userId: user.id}});
                        if (birthday) {
                            const channel = client.channels.cache.get('405147700825292827');
                            const user = client.users.cache.get(birthday.userId);

                            await channel.send(`It is ${user.toString()}'s birthday today!`);
                        }
                    });

                    await command.editReply(`Okay! I have set ${user.toString()}'s birthday as ${displayDate}`);

                    break;
                }

                case 'get': {
                    const user = command.options.getUser('user');
                    const birthday = await Birthdays.findOne({where: {userId: user.id}});

                    const displayDate = getTimeMarkdown(birthday.date);

                    if (birthday) {
                        await command.editReply(`${user.toString()}'s birthday is ${displayDate}`);

                    } else {
                        await command.editReply(`${user.toString()} does not have a birthday set`);
                    }

                    break;
                }

                case 'list': {
                    const birthdays = await Birthdays.findAll();

                    const embed = new discord.MessageEmbed()
                        .setAuthor(`Birthdays`)
                        .setColor(0x2F3136);

                    if (birthdays.length === 0) {
                        embed.setDescription('There are no birthdays set');

                    } else {
                        let counter = 1;
                        for (const birthday of birthdays) {
                            const user = command.users.cache.get(birthday.userId);
                            if (!user) continue;

                            embed.addField(`${counter}. ${user.toString()}`, `${getTimeMarkdown(birthday.date)}`);
                            counter++;
                        }
                    }

                    break;
                }

                case 'remove': {
                    const user = command.options.getUser('user');
                    const birthday = await Birthdays.findOne({where: {userId: user.id}});

                    if (birthday) {
                        await birthday.destroy();
                        await command.editReply(`Okay! I have removed ${user.toString()}'s birthday`);

                    } else {
                        await command.editReply(`${user.toString()} does not have a birthday set`);
                    }

                    break;
                }
            }

        } catch (err) {
            logger.error(err);
        }
    },

    data: [
        {
            type: 'CHAT_INPUT',
            name: 'birthday',
            description: 'Set and get birthdays',
            options: [
                {
                    type: 'SUB_COMMAND',
                    name: 'set',
                    description: 'Set a user\'s birthday',
                    options: [
                        {
                            type: 'USER',
                            name: 'user',
                            description: 'The user to set the birthday for',
                            required: true
                        },
                        {
                            type: 'STRING',
                            name: 'month',
                            description: 'The month of the birthday',
                            required: true,
                            choices: [
                                {
                                    name: 'January',
                                    value: '01'
                                },
                                {
                                    name: 'February',
                                    value: '02'
                                },
                                {
                                    name: 'March',
                                    value: '03'
                                },
                                {
                                    name: 'April',
                                    value: '04'
                                },
                                {
                                    name: 'May',
                                    value: '05'
                                },
                                {
                                    name: 'June',
                                    value: '06'
                                },
                                {
                                    name: 'July',
                                    value: '07'
                                },
                                {
                                    name: 'August',
                                    value: '08'
                                },
                                {
                                    name: 'September',
                                    value: '09'
                                },
                                {
                                    name: 'October',
                                    value: '10'
                                },
                                {
                                    name: 'November',
                                    value: '11'
                                },
                                {
                                    name: 'December',
                                    value: '12'
                                }
                            ]
                        },
                        {
                            type: 'INTEGER',
                            name: 'day',
                            description: 'The day of the birthday',
                            required: true
                        },
                        {
                            type: 'INTEGER',
                            name: 'year',
                            description: 'The year of the birthday',
                            required: true
                        },
                        {
                            type: 'STRING',
                            name: 'timezone',
                            description: 'The timezone of the birthday',
                            required: true
                        }
                    ]
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'get',
                    description: 'Gets a birthday',
                    options: [
                        {
                            type: 'USER',
                            name: 'user',
                            description: 'The user to get the birthday of',
                            required: true
                        }
                    ]
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'list',
                    description: 'List all birthdays'
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'remove',
                    description: 'Remove a user\'s birthday',
                    options: [
                        {
                            type: 'USER',
                            name: 'user',
                            description: 'The user to remove the birthday from',
                            required: true
                        }
                    ]
                }
            ]
        }
    ],

    flags: {
        developer: false,
        guild: '396523509871935489'
    }
};
