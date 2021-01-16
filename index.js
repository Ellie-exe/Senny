const Discord = require('discord.js');
const constants = require('./utils/constants');
const logger = require('@jakeyprime/logger');
const schedule = require('node-schedule');
const dateFormat = require('dateformat');
const {exec} = require('child_process');
const Enmap = require('enmap');
const fs = require('fs');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

const enmap = new Enmap({name: 'senny'});
(async function() {await enmap.defer}());

const indexes = enmap.indexes;

for (let i = 0; i < indexes.length; i++) {
    const key = indexes[i];
    const date = enmap.get(key, 'date');

    schedule.scheduleJob(date, function() {
        if (enmap.indexes.includes(key)) {
            const channel = client.channels.cache.get(enmap.get(key, 'channel_id'));
            const author = client.users.cache.get(enmap.get(key, 'author_id'));
            const text = enmap.get(key, 'text');

            channel.send(`Hello ${author.toString()}! You asked me to remind you about: \`${text}\``);
            enmap.delete(key);
        }
    });
}

class Interaction {
    constructor(interaction) {
        this.token = interaction.token;
        this.member = interaction.member;
        this.user = interaction.member.user;
        this.id = interaction.id;
        this.guild_id = interaction.guild_id;
        this.data = interaction.data;
        this.channel_id = interaction.channel_id;
        this.client = client;
    }

    async send(content, type = 4, flags = 0) {
        client.api
            .interactions(this.id)(this.token)
            .callback
            .post(
                {
                    data: {
                        type: type, 
                        data: {
                            content: content,
                            flags: flags
                        }
                    }
                }
            )
            .catch(err => logger.error(err));
    }

    async embed(embed, type = 4) {
        client.api
            .interactions(this.id)(this.token)
            .callback
            .post(
                {
                    data: {
                        type: type, 
                        data: {
                            embeds: [embed]
                        }
                    }
                }
            )
            .catch(err => logger.error(err));
    }

    async edit(content) {
        client.api
            .webhooks((await client.fetchApplication()).id)(this.token)
            .messages('@original')
            .patch(
                {
                    data: {
                        content: content
                    }
                }
            )
            .catch(err => logger.error(err));
    }

    async delete() {
        client.api
            .webhooks((await client.fetchApplication()).id)(this.token)
            .messages('@original')
            .delete()
            .catch(err => logger.error(err));
    }
}

client.on('shardReady', () => {
    let counter = -1;
    
    setInterval(() => {
        (counter === 3) ? counter = 0 : counter++;

        const activity = [
            {type: 'LISTENING', name: '/'},
            {type: 'WATCHING', name: 'over Bongo'},
            {type: 'PLAYING', name: 'with the API'},
            {type: 'WATCHING', name: `${client.guilds.cache.array().length} Guilds`}
        ];

        client.user.setActivity(activity[counter].name, {type: activity[counter].type});
    
    }, 30000);

    logger.info(`Bot ready in ${client.guilds.cache.array().length} guilds`);
});

client.on('shardReconnecting', () => {
    logger.warning('Bot reconnecting');
});

client.on('shardError', err => {
    logger.error(err);
});

client.on('error', err => {
    logger.error(err);
});

process.on('unhandledRejection', err => {
    logger.error(err);
});

client.ws.on('INTERACTION_CREATE', interaction => client.emit('interactionCreate', new Interaction(interaction)));

client.on('interactionCreate', command => {
    if (!client.commands.has(command.data.name)) return;

    try {
        logger.info(`${command.channel_id} ${command.user.username}#${command.user.discriminator}: /${command.data.name}`);
        client.commands.get(command.data.name).execute(i);
    
    } catch (err) {
        logger.error(err);
        command.send(`${constants.emojis.redX} Error: \`${err}\``, 3, 64);
    
    }
});

client.on('message', message => {
    const args = message.content.slice(process.env.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (message.author.bot) return;

    if (message.content.startsWith(process.env.prefix + 'reload')) {
        try {
            logger.info(`${message.channel.id} ${message.author.tag}: ${process.env.prefix}reload`);

            if(process.env.owners.includes(message.author.id) === false) {
                message.channel.send(`${constants.emojis.redX} Error: \`DiscordAPIError: Missing Permissions\``);
                return;
            }

            message.react(constants.emojis.greenTick);

            for (const file of commandFiles) {
                delete require.cache[require.resolve(`./commands/${file}`)];
                        
                const command = require(`./commands/${file}`);
                client.commands.set(command.name, command);
            }
        
        } catch (err) {
            logger.error(err);
            message.channel.send(`${constants.emojis.redX} Error: \`${err}\``);
        
        }

        return;
    }
    
    if (message.content.startsWith('!d bump') && message.channel.guild.id === '573272766149558272') {
        try {
            logger.info(`${message.channel.id} ${message.author.tag}: !d bump`);

            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
            const text = '!d bump';
            const date = Date.now() + 7200000;
            const display = dateFormat(date, 'mmmm d, yyyy "at" h:MM TT Z')
            
            let key = '';

            for (let i = 0; i < 5; i++) {
                key += characters.charAt(Math.random() * characters.length);
            }

            const reminder = {
                author_id: message.author.id,
                channel_id: message.channel.id,
                channel_type: message.channel.type,
                text: text,
                date: date
            }

            enmap.set(key, reminder);
            message.channel.send(`Okay, I'll remind ${message.channel} about: \`!d bump\` at: \`${display}\``);

            schedule.scheduleJob(date, function() {
                if (enmap.indexes.includes(key)) {
                    message.channel.send(`Hello ${message.author.toString()}! You asked me to remind you about: \`${text}\``);
                    enmap.delete(key);
                }
            });
        
        } catch (err) {
            logger.error(err);
            message.channel.send(`${constants.emojis.redX} Error: \`${err}\``);
        
        }

        return;
    }

    if (!message.content.startsWith(process.env.prefix) || message.author.bot || !client.commands.has(command)) return;

    try {
        if (command === 'dev') {
            logger.info(`${message.channel.id} ${message.author.tag}: ${process.env.prefix}${command} ${args.join(' ')}`);

        } else {
            logger.info(`${message.channel.id} ${message.author.tag}: ${process.env.prefix}${command}`);
            
        }

        client.commands.get(command).execute(message, args);
    
    } catch (err) {
        logger.error(err);
        message.channel.send(`${constants.emojis.redX} Error: \`${err}\``);
    
    }
});

client.login(process.env.token);