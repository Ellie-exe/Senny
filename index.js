const Discord = require('discord.js');
const logger = require('@jakeyprime/logger');
const fs = require('fs');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
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
            .post({
                data: {
                    type: type, 
                    data: {
                        content: content,
                        flags: flags
                    }
                }
            })
            .catch(err => logger.error(err));
    }

    async embed(embed, type = 4) {
        client.api
            .interactions(this.id)(this.token)
            .callback
            .post({
                data: {
                    type: type, 
                    data: {
                        embeds: [embed]
                    }
                }
            })
            .catch(err => logger.error(err));
    }

    async edit(content) {
        client.api
            .webhooks((await client.fetchApplication()).id)(this.token)
            .messages('@original')
            .patch({
                data: {
                    content: content
                }
            })
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
    logger.warn('Bot reconnecting');
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

client.ws.on('INTERACTION_CREATE', i => client.emit('interactionCreate', new Interaction(i)));

client.on('interactionCreate', i => {
    if (!client.commands.has(i.data.name)) return;

    try {
        logger.info(`${i.channel_id} ${i.user.username}#${i.user.discriminator}: /${i.data.name}`);
        client.commands.get(i.data.name).execute(i);
    
    } catch (err) {
        logger.error(err);
    
    }
});

client.on('message', message => {
    const args = message.content.slice(process.env.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (message.author.bot) return;
    
    if (message.content.startsWith('!d bump') && message.channel.guild.id === '573272766149558272') {
        try {
            logger.info(`${message.channel.id} ${message.author.tag}: !d bump`);
            message.channel.send(`Okay, I'll remind ${message.channel} about: \`!d bump\` in: \`2 hours\``);

            setTimeout(function () {
                message.channel.send(`Hello ${message.author.toString()}! You asked me to remind you about: \`!d bump\``);
            
            }, 7200000);
        
        } catch (err) {
            logger.error(err);
        
        }

        return;
    }

    if (message.content.startsWith(process.env.prefix + 'reload')) {
        try {
            logger.info(`${message.channel.id} ${message.author.tag}: ${process.env.prefix}reload`);

            if(process.env.owners.includes(message.author.id) === false) {
                message.channel.send('<:red_x:717257458657263679> Error: `DiscordAPIError: Missing Permissions`');
                return;
            }

            message.react('<:green_tick:717257440202326058>');

            for (const file of commandFiles) {
                delete require.cache[require.resolve(`./commands/${file}`)];
                        
                const command = require(`./commands/${file}`);
                client.commands.set(command.name, command);
            }
        
        } catch (err) {
            logger.error(err);
        
        }

        return;
    }

    if (!message.content.startsWith(process.env.prefix) || message.author.bot) return;

    try {
        logger.info(`${message.channel.id} ${message.author.tag}: ${process.env.prefix}${command}`);
        client.commands.get(command).execute(message, args);
    
    } catch (err) {
        logger.error(err);
    
    }
});

client.login(process.env.token);