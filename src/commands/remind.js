const schedule = require('node-schedule');
const dateFormat = require('dateformat');

module.exports = {
    /**
     * @param {import('../utils').Interaction} command
     * @param {import('../utils')} utils
     */
    async execute(command, utils) {
        try {
            const database = new utils.database();

            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            const data = command.data.options[0];

            const userID = command.authorID;
            const user = await command.client.users.fetch(userID);
            const guild = command.client.guilds.cache.get(command.guildID);

            /**
             * @param {string} time
             */
            function parse(time) {
                const times = time.match(/\d+\s*\w+/g);

                let years = 0;
                let months = 0;
                let weeks = 0;
                let days = 0;
                let hours = 0;
                let minutes = 0;
                let seconds = 0;

                times.forEach(time => {
                    const value = time.match(/\d+/g)[0];
                    const label = time.match(/(?<=\s|\d)(mo|[ywdhms])/gi)[0];

                    switch (label) {
                        case 'y':
                            years = value * 365 * 24 * 60 * 60 * 1000;
                            break;

                        case 'mo':
                            months = value * 30 * 24 * 60 * 60 * 1000;
                            break;

                        case 'w':
                            weeks = value * 7 * 24 * 60 * 60 * 1000;
                            break;

                        case 'd':
                            days = value * 24 * 60 * 60 * 1000;
                            break;

                        case 'h':
                            hours = value * 60 * 60 * 1000;
                            break;

                        case 'm':
                            minutes = value * 60 * 1000;
                            break;

                        case 's':
                            seconds = value * 1000;
                            break;
                    }
                });

                return years + months + weeks + days + hours + minutes + seconds;
            }

            switch (data.name) {
                case 'here': {
                    const type = data.options[0].value;
                    const time = data.options[1].value;
                    const text = data.options[2].value;
                    const channelID = command.channelID;

                    let date;
                    let reminderID = '';

                    for (let i = 0; i < 5; i++) {
                        const num = Math.floor(Math.random() * chars.length);
                        reminderID += chars.charAt(num);
                    }

                    switch (type) {
                        case 'duration':
                            date = Date.now() + parse(time);
                            break;

                        case 'date':
                            date = Date.parse(time);
                            break;
                    }

                    const display = dateFormat(date, 'mmmm d, yyyy "at" h:MM TT Z');
                    const channel = guild.channels.cache.get(channelID);

                    await database
                        .insert('reminders')
                        .values(reminderID, channelID, userID, date, text)
                        .query(async (err) => {
                            if (err) await database.error(err);
                            await command.send(`Okay! I'll remind you here about \`${text}\` at \`${display}\``);
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

                            }).catch(async (err) => {utils.logger.error(err)});
                    });

                    break;
                }

                case 'me': {
                    const type = data.options[0].value;
                    const time = data.options[1].value;
                    const text = data.options[2].value;

                    let date;
                    let reminderID = '';

                    for (let i = 0; i < 5; i++) {
                        const num = Math.floor(Math.random() * chars.length);
                        reminderID += chars.charAt(num);
                    }

                    switch (type) {
                        case 'duration':
                            date = Date.now() + parse(time);
                            break;

                        case 'date':
                            date = Date.parse(time);
                            break;
                    }

                    const display = dateFormat(date, 'mmmm d, yyyy "at" h:MM TT Z');

                    const channel = await user.createDM();
                    const channelID = channel.id;

                    await database
                        .insert('reminders')
                        .values(reminderID, channelID, userID, date, text)
                        .query(async (err) => {
                            if (err) await database.error(err);
                            await command.send(`Okay! I'll remind you in DMs about \`${text}\` at \`${display}\``);
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
                                        await channel.send(`Hello ${user.username}! You asked me to remind you about \`${text}\``);
                                    });

                            }).catch(async (err) => {utils.logger.error(err)});
                    });

                    break;
                }

                case 'list': {
                    await database
                        .select('*')
                        .from('reminders')
                        .where('userID', userID)
                        .query(async (err, res) => {
                            if (err) throw err;

                            const embed = new utils.MessageEmbed()
                                .setAuthor(`${user.tag} - Reminders`)
                                .setColor(process.env.color);

                            if (res.length === 0) {
                                embed.setDescription('You have no reminders');
                            
                            } else {
                                res.forEach(async (reminder) => {
                                    const date = reminder.date;
                                    const text = reminder.text;
        
                                    const channelID = reminder.channelID;
                                    const channel = await command.client.channels.fetch(channelID);
        
                                    embed.addField(
                                        `Reminder [\`${reminder.reminderID}\`]`,
                                        `Destination: ${channel}\n`+
                                        `Time: \`${dateFormat(date, 'mmmm d, yyyy "at" h:MM TT Z')}\`\n`+
                                        `Text: \`${text}\``
                                    );
                                });
                            }

                            await command.embed([embed]);
                        
                        }).catch(async (err) => {utils.logger.error(err)});

                    break;
                }

                case 'delete': {
                    const reminderID = data.options[0].value.toUpperCase();

                    if (reminderID === 'ALL') {
                        await new utils.database()
                            .select('*')
                            .from('reminders')
                            .where('userID', userID)
                            .query(async (err, res) => {
                                if (err) throw err;
                                if (res.length === 0) throw Error('You have no reminders to delete');

                                res.forEach(async (reminder) => {
                                    await new utils.database()
                                        .delete('reminders')
                                        .where('reminderID', reminder.reminderID)
                                        .query(async (err) => {if (err) throw err});
                                });

                                await command.send('Okay! I\'ll delete all your reminders');
                            
                            }).catch(async (err) => {utils.logger.error(err)});
                    
                    } else {
                        await new utils.database()
                            .select('*')
                            .from('reminders')
                            .where('reminderID', reminderID)
                            .query(async (err, res) => {
                                if (err) throw err;
                                if (res.length === 0) throw new Error('That reminder does not exist');
                                if (res[0].userID !== userID) throw new Error('You cannot delete someone else\'s reminders');

                                await new utils.database()
                                    .delete('reminders')
                                    .where('reminderID', reminderID)
                                    .query(async (err) => {
                                        if (err) throw err;
                                        await command.send(`Okay! I\'ll delete your reminder \`${reminderID}\``);
                                    });
                            
                            }).catch(async (err) => {utils.logger.error(err)});
                    }

                    break;
                }
            }

        } catch (err) {
            await command.error(err);
        }
    },

    data: {
        name: 'remind',
        description: 'Set a reminder',
        options: [
            {
                name: 'here',
                description: 'Send a reminder in the current channel',
                type: 1,
                options: [
                    {
                        name: 'type',
                        description: 'Type of time',
                        required: true,
                        type: 3,
                        choices: [
                            {
                                name: 'duration',
                                value: 'duration'
                            },
                            {
                                name: 'date',
                                value: 'date'
                            }
                        ]
                    },
                    {
                        name: 'time',
                        description: 'Time to remind',
                        required: true,
                        type: 3
                    },
                    {
                        name: 'text',
                        description: 'Text to remind',
                        required: true,
                        type: 3
                    }
                ]
            },
            {
                name: 'me',
                description: 'Send a reminder in DMs',
                type: 1,
                options: [
                    {
                        name: 'type',
                        description: 'Type of time',
                        type: 3,
                        required: true,
                        choices: [
                            {
                                name: 'duration',
                                value: 'duration'
                            },
                            {
                                name: 'date',
                                value: 'date'
                            }
                        ]
                    },
                    {
                        name: 'time',
                        description: 'Time to remind',
                        required: true,
                        type: 3
                    },
                    {
                        name: 'text',
                        description: 'Text to remind',
                        required: true,
                        type: 3
                    }
                ]
            },
            {
                name: 'list',
                description: 'List your reminders',
                type: 1
            },
            {
                name: 'delete',
                description: 'Delete a reminder',
                type: 1,
                options: [
                    {
                        name: 'id',
                        description: 'ID of reminder',
                        required: true,
                        type: 3
                    }
                ]
            }
        ]
    }
};
