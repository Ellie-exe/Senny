module.exports = {
    name: 'remind',
    async execute(command) {
        const constants = require('../utils/constants');
        const {MessageEmbed} = require('discord.js');
        const logger = require('@jakeyprime/logger');
        const schedule = require('node-schedule');
        const dateFormat = require('dateformat');
        const Enmap = require('enmap');

        const enmap = new Enmap({name: 'senny'});
        (async function() {await enmap.defer}());

        const data = command.data.options[0];

        function parse(time) {
            const values = time.split(' ');

            let years = 0;
            let months = 0;
            let weeks = 0;
            let days = 0;
            let hours = 0;
            let minutes = 0;
            let seconds = 0;

            for (let i = 0; i < values.length; i++) {
                switch (values[i]) {
                    case 'year': {
                        years = values[i - 1] * 365 * 24 * 60 * 60 * 1000;
                        break;
                    }
                                
                    case 'years': {
                        years = values[i - 1] * 365 * 24 * 60 * 60 * 1000;
                        break;
                    }

                    case 'month': {
                        months = values[i - 1] * 30 * 24 * 60 * 60 * 1000;
                        break;
                    }

                    case 'months': {
                        months = values[i - 1] * 30 * 24 * 60 * 60 * 1000;
                        break;
                    }

                    case 'week': {
                        weeks = values[i - 1] * 7 * 24 * 60 * 60 * 1000;
                        break;
                    }

                    case 'weeks': {
                        weeks = values[i - 1] * 7 * 24 * 60 * 60 * 1000;
                        break;
                    }
                        
                    case 'day': {
                        days = values[i - 1] * 24 * 60 * 60 * 1000;
                        break;
                    }

                    case 'days': {
                        days = values[i - 1] * 24 * 60 * 60 * 1000;
                        break;
                    }

                    case 'hour': {
                        hours = values[i - 1] * 60 * 60 * 1000;
                        break;
                    }

                    case 'hours': {
                        hours = values[i - 1] * 60 * 60 * 1000;
                        break;
                    }

                    case 'minute': {
                        minutes = values[i - 1] * 60 * 1000;
                        break;
                    }

                    case 'minutes': {
                        minutes = values[i - 1] * 60 * 1000;
                        break;
                    }

                    case 'second': {
                        seconds = values[i - 1] * 1000;
                        break;
                    }

                    case 'seconds': {
                        seconds = values[i - 1] * 1000;
                        break;
                    }
                        
                    case 'and': {
                        break;
                    }

                    default: {
                        switch (values[i].charAt(values[i].length - 1)) {
                            case 'y': {
                                years = values[i].substring(0, values[i].length - 1) * 365 * 24 * 60 * 60 * 1000;
                                break;
                            }

                            case 'o': {
                                months = values[i].substring(0, values[i].length - 2) * 30 * 24 * 60 * 60 * 1000;
                                break;
                            }

                            case 'w': {
                                weeks = values[i].substring(0, values[i].length - 1) * 7 * 24 * 60 * 60 * 1000;
                                break;
                            }

                            case 'd': {
                                days = values[i].substring(0, values[i].length - 1) * 24 * 60 * 60 * 1000;
                                break;
                            }

                            case 'h': {
                                hours = values[i].substring(0, values[i].length - 1) * 60 * 60 * 1000;
                                break;
                            }

                            case 'm': {
                                minutes = values[i].substring(0, values[i].length - 1) * 60 * 1000;
                                break;
                            }

                            case 's': {
                                seconds = values[i].substring(0, values[i].length - 1) * 1000;
                                break;
                            }
                        }
                    }
                }
            }

            return years + months + weeks + days + hours + minutes + seconds;
        }

        switch (data.name) {
            case 'here': {
                const type = data.options[0].value;
                const time = data.options[1].value;
                const text = data.options[2].value;

                let date;

                switch (type) {
                    case 'duration': {
                        date = Date.now() + parse(time);
                        break;
                    }

                    case 'date': {
                        date = Date.parse(time);
                        break;
                    }
                }

                const author = command.client.users.cache.get(command.user.id);
                const channel = command.client.channels.cache.get(command.channel_id);
                const display = dateFormat(date, 'mmmm d, yyyy "at" h:MM TT Z');
                const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
                
                let key = '';

                for (let i = 0; i < 5; i++) {
                    key += characters.charAt(Math.random() * characters.length);
                }

                const reminder = {
                    author_id: author.id,
                    channel_id: channel.id,
                    channel_type: channel.type,
                    date: date,
                    text: text
                }

                command.send(`Okay, I'll remind ${channel} about: \`${text}\` at: \`${display}\``);
                enmap.set(key, reminder);

                schedule.scheduleJob(date, function() {
                    if (enmap.indexes.includes(key)) {
                        channel.send(`Hello ${author.toString()}! You asked me to remind you about: \`${text}\``);
                        enmap.delete(key);
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
                    case 'duration': {
                        date = Date.now() + parse(time);
                        break;
                    }

                    case 'date': {
                        date = Date.parse(time);
                        break;
                    }
                }

                const author = command.client.users.cache.get(command.user.id);
                const channel = await author.createDM();
                const display = dateFormat(date, 'mmmm d, yyyy "at" h:MM TT Z');
                const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
                
                let key = '';

                for (let i = 0; i < 5; i++) {
                    key += characters.charAt(Math.random() * characters.length);
                }

                const reminder = {
                    author_id: author.id,
                    channel_id: channel.id,
                    channel_type: channel.type,
                    date: date,
                    text: text
                }

                command.send(`Okay, I'll remind you about: \`${text}\` at: \`${display}\``);
                enmap.set(key, reminder);

                schedule.scheduleJob(date, function() {
                    if (enmap.indexes.includes(key)) {
                        channel.send(`Hello ${author.toString()}! You asked me to remind you about: \`${text}\``);
                        enmap.delete(key);
                    }
                });
                
                break;
            }

            case 'list': {
                const author = command.client.users.cache.get(command.user.id);
                const indexes = enmap.indexes;
                
                let keys = [];

                for (let i = 0; i < indexes.length; i++) {
                    if (enmap.get(indexes[i], 'author_id') === author.id) {
                        keys.push(indexes[i]);
                    }
                }

                const reminders = enmap.fetch(keys);
                const embed = new MessageEmbed()
                    .setAuthor(`${author.tag} - Reminders`)
                    .setColor(process.env.color);

                if (keys.length === 0) {
                    embed.setDescription('You have no reminders');
                
                } else {
                    for (let i = 0; i < keys.length; i++) {
                        const channel_id = reminders.get(keys[i], 'channel_id');
                        const channel_type = reminders.get(keys[i], 'channel_type');
                        const date = reminders.get(keys[i], 'date');
                        const text = reminders.get(keys[i], 'text');

                        let channel = '';

                        switch (channel_type === 'dm') {
                            case true: {
                                channel = `<@${author.id}>`;
                                break;
                            }
                        
                            case false: {
                                channel = `<#${channel_id}>`;
                                break;
                            }
                        }

                        embed.addField(
                            `Reminder [\`${keys[i]}\`]`,
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
                const id = data.options[0].value;

                if (enmap.indexes.includes(id)) {
                    enmap.delete(id);
                    command.send(`Okay, I'll delete the reminder: \`${id}\``);
                
                } else {
                    const err = 'That reminder does not exist'
                    logger.error(err);
                    command.send(`${constants.emojis.redX} Error: \`${err}\``);
                
                }
                
                break;
            }
        }
    }
};