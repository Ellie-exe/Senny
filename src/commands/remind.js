const { MessageEmbed } = require('discord.js');
const schedule = require('node-schedule');
const dateFormat = require('dateformat');
const Enmap = require('enmap');
/**
 * @param {import('../../types').Interaction} command
 * @param {import('../../types').Utils} utils
 */
module.exports.execute = async (command, utils) => {
    try {
        const reminder = new Enmap({name: 'reminder'});

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

                const author = await command.client.users.fetch(command.user.id);
                const channel = command.client.channels.cache.get(command.channelID);
                const display = dateFormat(date, 'mmmm d, yyyy "at" h:MM TT Z');
                const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

                let reminderID = '';
                for (let i = 0; i < 5; i++) reminderID += characters.charAt(Math.random() * characters.length);

                reminder.set(reminderID, {
                    authorID: author.id,
                    channelID: channel.id,
                    channelType: channel.type,
                    date: date,
                    text: text
                });

                command.send(`Okay, I'll remind ${channel} about: \`${text}\` at: \`${display}\``);

                schedule.scheduleJob(date, async () => {
                    try {
                        const mention = author.toString();
                        if (reminder.indexes.includes(reminderID)) {
                            await channel.send(`Hello ${mention}! You asked me to remind you about: \`${text}\``);
                            reminder.delete(reminderID);
                        }

                    } catch (err) {
                        channel.send(`${utils.constants.emojis.redX} Error: \`${err}\``).catch(err => utils.logger.error(err));
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

                const author = await command.client.users.fetch(command.authorID);
                const channel = await author.createDM();
                const display = dateFormat(date, 'mmmm d, yyyy "at" h:MM TT Z');
                const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

                let reminderID = '';
                for (let i = 0; i < 5; i++) {
                    reminderID += characters.charAt(Math.random() * characters.length);
                }

                reminder.set(reminderID, {
                    authorID: author.id,
                    channelID: channel.id,
                    channelType: channel.type,
                    date: date,
                    text: text
                });

                command.send(`Okay, I'll remind you about: \`${text}\` at: \`${display}\``);

                schedule.scheduleJob(date, async () => {
                    try {
                        const mention = author.toString();
                        if (reminder.indexes.includes(reminderID)) {
                            await channel.send(`Hello ${mention}! You asked me to remind you about: \`${text}\``);
                            reminder.delete(reminderID);
                        }

                    } catch (err) {
                        channel.send(`${utils.constants.emojis.redX} Error: \`${err}\``).catch(err => utils.logger.error(err));
                        utils.logger.error(err);
                    }
                });

                break;
            }

            case 'list': {
                const author = await command.client.users.fetch(command.authorID);
                const indexes = reminder.indexes;

                let reminderIDs = [];
                for (let i = 0; i < indexes.length; i++) {
                    if (reminder.get(indexes[i], 'authorID') === author.id) {
                        reminderIDs.push(indexes[i]);
                    }
                }

                const reminders = reminder.fetch(reminderIDs);
                const embed = new MessageEmbed()
                    .setAuthor(`${author.tag} - Reminders`)
                    .setColor(process.env.color);

                if (reminderIDs.length === 0) {
                    embed.setDescription('You have no reminders');

                } else {
                    for (let i = 0; i < reminderIDs.length; i++) {
                        const channelID = reminders.get(reminderIDs[i], 'channelID');
                        const channelType = reminders.get(reminderIDs[i], 'channelType');
                        const date = reminders.get(reminderIDs[i], 'date');
                        const text = reminders.get(reminderIDs[i], 'text');

                        switch (channelType === 'dm') {
                            case true:
                                var channel = `<@${author.id}>`;
                                break;

                            case false:
                                var channel = `<#${channelID}>`;
                                break;
                        }

                        embed.addField(
                            `Reminder [\`${reminderIDs[i]}\`]`,
                            `Destination: ${channel}\n`+
                            `Time: \`${dateFormat(date, 'mmmm d, yyyy "at" h:MM TT Z')}\`\n`+
                            `Text: \`${text}\``
                        );
                    }
                }

                command.embed(embed);
                break;
            }

            case 'delete': {
                const id = data.options[0].value.toUpperCase();
                const author = await command.client.users.fetch(command.authorID);
                const indexes = reminder.indexes;

                let reminderIDs = [];

                for (let i = 0; i < indexes.length; i++) {
                    if (reminder.get(indexes[i], 'authorID') === author.id) {
                        reminderIDs.push(indexes[i]);
                    }
                }

                if (id.toLowerCase() === 'all') {
                    command.send(`Okay, I'll delete all your reminders`);

                    for (let i = 0; i < reminderIDs.length; i++) {
                        reminder.delete(reminderIDs[i]);
                    }

                    return;
                }

                if (!reminderIDs.includes(id)) {
                    throw new Error('You cannot delete someone else\'s reminders');
                }

                if (reminder.indexes.includes(id)) {
                    command.send(`Okay, I'll delete the reminder: \`${id}\``);
                    reminder.delete(id);

                } else {
                    const err = 'That reminder does not exist';
                    command.send(`${utils.constants.emojis.redX} Error: \`${err}\``, {type: 3, flags: 64});
                    utils.logger.error(err);
                }

                break;
            }
        }

    } catch (err) {
        command.send(`${utils.constants.emojis.redX} Error: \`${err}\``, {type: 3, flags: 64});
        utils.logger.error(err);
    }
};