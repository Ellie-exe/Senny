const { MessageEmbed } = require('discord.js');
const schedule = require('node-schedule');
const dateFormat = require('dateformat');
const mariadb = require('mariadb');
/**
 * @param {import('../../types').Interaction} command
 * @param {import('../../types').Utils} utils
 */
module.exports.execute = async (command, utils) => {
    try {
        const conn = await mariadb.createConnection({
            user: process.env.user,
            password: process.env.password,
            database: process.env.database
        });

        const data = command.data.options[0];

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

                let date;

                switch (type) {
                    case 'duration':
                        date = Date.now() + parse(time);
                        break;

                    case 'date':
                        date = Date.parse(time);
                        break;
                }

                const user = await command.client.users.fetch(command.user.id);
                const channel = command.client.channels.cache.get(command.channelID);
                const display = dateFormat(date, 'mmmm d, yyyy "at" h:MM TT Z');
                const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

                let reminderID = '';
                for (let i = 0; i < 5; i++) reminderID += characters.charAt(Math.floor(Math.random() * characters.length));

                await conn.query('INSERT INTO reminders VALUES (?, ?, ?, ?, ?)', [reminderID, user.id, channel.id, date, text]);
                command.send(`Okay, I'll remind ${channel} about: \`${text}\` at: \`${display}\``);

                schedule.scheduleJob(date, async () => {
                    try {
                        const reminder = await conn.query('SELECT reminderID FROM reminders WHERE reminderID=(?)', [reminderID]);
                        if (reminder.length === 0) return;

                        await channel.send(`Hello ${user.toString()}! You asked me to remind you about: \`${text}\``);
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

                switch (type) {
                    case 'duration':
                        date = Date.now() + parse(time);
                        break;

                    case 'date':
                        date = Date.parse(time);
                        break;
                }

                const user = await command.client.users.fetch(command.user.id);
                const channel = await user.createDM();
                const display = dateFormat(date, 'mmmm d, yyyy "at" h:MM TT Z');
                const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

                let reminderID = '';
                for (let i = 0; i < 5; i++) reminderID += characters.charAt(Math.floor(Math.random() * characters.length));

                await conn.query('INSERT INTO reminders VALUES (?, ?, ?, ?, ?)', [reminderID, user.id, channel.id, date, text]);
                command.send(`Okay, I'll remind you about: \`${text}\` at: \`${display}\``);

                schedule.scheduleJob(date, async () => {
                    try {
                        const reminder = await conn.query('SELECT reminderID FROM reminders WHERE reminderID=(?)', [reminderID]);
                        if (reminder.length === 0) return;

                        await channel.send(`Hello ${user.toString()}! You asked me to remind you about: \`${text}\``);
                        await conn.query('DELETE FROM reminders WHERE reminderID=(?)', [reminderID]);

                        await conn.end();

                    } catch (err) {
                        utils.logger.error(err);
                    }
                });

                break;
            }

            case 'list': {
                const user = await command.client.users.fetch(command.user.id);
                const reminders = await conn.query('SELECT * FROM reminders WHERE userID=(?)', [user.id]);

                const embed = new MessageEmbed()
                    .setAuthor(`${user.tag} - Reminders`)
                    .setColor(process.env.color);

                if (reminders.length === 0) {
                    embed.setDescription('You have no reminders');

                } else {
                    reminders.forEach(async reminder => {
                        const date = reminder.date;
                        const text = reminder.text;
                        const channelID = reminder.channelID;
                        const channel = command.client.channels.cache.get(channelID);

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
                const user = await command.client.users.fetch(command.user.id);

                if (reminderID === 'ALL') {
                    const reminders = await conn.query('SELECT * FROM reminders WHERE userID=(?)', [user.id]);
                    if (reminders.length === 0) throw new Error('You have no reminders to delete');

                    reminders.forEach(async reminder => {
                        await conn.query('DELETE FROM reminders WHERE reminderID=(?)', [reminder.reminderID]);
                    })

                    command.send(`Okay, I've deleted all your reminders`);
                    await conn.end();
                    return;
                }

                const reminder = await conn.query('SELECT * FROM reminders WHERE reminderID=(?)', [reminderID]);

                if (reminder.length === 0) throw new Error('That reminder does not exist');
                if (reminder[0].userID !== user.id) throw new Error('You cannot delete someone else\`s reminders');

                await conn.query('DELETE FROM reminders WHERE reminderID=(?)', [reminderID]);
                command.send(`Okay, I've deleted the reminder: \`${reminderID}\``);

                await conn.end();
                break;
            }
        }

    } catch (err) {
        command.send(`${utils.constants.emojis.redX} ${err.name}: \`${err.message}\``, {type: 3, flags: 64});
        utils.logger.error(err);
    }
};
