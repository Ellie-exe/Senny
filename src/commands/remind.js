const schedule = require('node-schedule');
const dateFormat = require('dateformat');
const mariadb = require('mariadb');

module.exports = {
    /**
     * @param {import('../utils').Interaction} command
     * @param {import('../utils')} utils
     */
    async execute(command, utils) {
        try {
            const conn = await mariadb.createConnection({
                user: process.env.user,
                password: process.env.password,
                database: process.env.database
            });

            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            const data = command.data.options[0];

            const userID = command.authorID;
            const user = await command.client.users.fetch(userID);

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

                    const channel = await command.client.channels.fetch(channelID);

                    const sql = 'INSERT INTO reminders VALUES (?, ?, ?, ?, ?)';
                    await conn.query(sql, [reminderID, channelID, userID, date, text]);

                    command.send(`${utils.constants.emojis.greenTick} __**Reminder set!**__ - \`${display}\`\n\`\`\`${text}\`\`\``);

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

                    const sql = 'INSERT INTO reminders VALUES (?, ?, ?, ?, ?)';
                    await conn.query(sql, [reminderID, channelID, userID, date, text]);

                    command.send(`${utils.constants.emojis.greenTick} __**Reminder set!**__ - \`${display}\`\n\`\`\`${text}\`\`\``);

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

                    break;
                }

                case 'list': {
                    const reminders = await conn.query('SELECT * FROM reminders WHERE userID=(?)', [userID]);

                    const embed = new utils.MessageEmbed()
                        .setAuthor(`${user.tag} - Reminders`)
                        .setColor(process.env.color);

                    if (reminders.length === 0) {
                        embed.setDescription('You have no reminders');

                    } else {
                        reminders.forEach(async reminder => {
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

                    command.embed([embed]);
                    break;
                }

                case 'delete': {
                    const reminderID = data.options[0].value.toUpperCase();

                    if (reminderID === 'ALL') {
                        const reminders = await conn.query('SELECT * FROM reminders WHERE userID=(?)', [userID]);
                        if (reminders.length === 0) throw new Error('You have no reminders to delete');

                        reminders.forEach(async reminder => {
                            await conn.query('DELETE FROM reminders WHERE reminderID=(?)', [reminder.reminderID]);
                        });

                        command.send(`${utils.constants.emojis.greenTick} __**Reminders deleted!**__ - \`All\``);

                        await conn.end();
                        return;
                    }

                    const reminder = await conn.query('SELECT * FROM reminders WHERE reminderID=(?)', [reminderID]);

                    if (reminder.length === 0) throw new Error('That reminder does not exist');
                    if (reminder[0].userID !== user.id) throw new Error('You cannot delete someone else\'s reminders');

                    await conn.query('DELETE FROM reminders WHERE reminderID=(?)', [reminderID]);
                    command.send(`${utils.constants.emojis.greenTick} __**Reminder deleted!**__ - \`${reminderID}\``);

                    await conn.end();
                    break;
                }
            }

        } catch (err) {
            command.error(err);
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
