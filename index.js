const Discord = require('discord.js');
const dateFormat = require('dateformat');
const logger = require('@jakeyprime/logger');
const { exec } = require('child_process');
const config = require('./config.json');

const client = new Discord.Client();

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

client.on('message', message => {
    const args = message.content.split(' ').slice(1);

    try {
        if (message.content.startsWith('!d bump') && message.channel.guild.id === '573272766149558272') {
            logger.info(`${message.channel.id} ${message.author.tag}: !d bump`);

            message.channel.send(`Okay, I'll remind ${message.channel} about: \`!d bump\` in: \`2h\``);

            setTimeout(function () {
                message.channel.send(`Hello ${message.author.toString()}! You asked me to remind you about: \`!d bump\``);
            }, 7200000);
        }

        if (message.content.startsWith(config.prefix + 'eval')) {
            logger.info(`${message.channel.id} ${message.author.tag}: /eval`);

            if(config.owners.includes(message.author.id) === false) {
                message.channel.send('<:red_x:717257458657263679> Error: `DiscordAPIError: Missing Permissions`');
                return;
            }
            
            try {
                const code = args.join(' ');
                let evaled = eval(code);
    
                if (typeof evaled !== 'string')
                    evaled = require('util').inspect(evaled);
    
                message.channel.send(evaled, {code: 'xl'})
                    .catch(err => {
                        message.channel.send(err, {code: 'xl'});
                        logger.error(err);
                    });
            
            } catch (err) {
                message.channel.send(err, {code: 'xl'});
                logger.error(err);
            }
        }

        if (message.content.startsWith(config.prefix + 'restart')) {
            logger.info(`${message.channel.id} ${message.author.tag}: /restart`);

            if(config.owners.includes(message.author.id) === false) {
                message.channel.send('<:red_x:717257458657263679> Error: `DiscordAPIError: Missing Permissions`');
                return;
            }

            message.react('<:green_tick:717257440202326058>');
            
            setTimeout(function () {
                exec('pm2 restart config.json && pm2 save');
            }, 2000);

        }

        if (message.content.startsWith(config.prefix + 'stop')) {
            logger.info(`${message.channel.id} ${message.author.tag}: /stop`);

            if(config.owners.includes(message.author.id) === false) {
                message.channel.send('<:red_x:717257458657263679> Error: `DiscordAPIError: Missing Permissions`');
                return;
            }

            message.react('<:green_tick:717257440202326058>');
            
            setTimeout(function () {
                exec('pm2 stop config.json && pm2 save');
            }, 2000);

        }

        if (message.content.startsWith(config.prefix + 'pull')) {
            logger.info(`${message.channel.id} ${message.author.tag}: /pull`);

            if(config.owners.includes(message.author.id) === false) {
                message.channel.send('<:red_x:717257458657263679> Error: `DiscordAPIError: Missing Permissions`');
                return;
            }

            exec('git pull origin master', (error, stdout, stderr) => {
                if (error) {
                    logger.error(error);
                    message.channel.send(`\`\`\`\n${error}\n\`\`\``);

                } else {
                    const content = {
                        embed: {
                            title: 'Git Pulled',
                            description: `\`\`\`\n${stdout}\n${stderr}\n\`\`\``,
                            color: config.color
                        }
                    };
                    
                    message.channel.send(content);
                }
            });
        }
    
    } catch (err) {
        message.channel.send(err, {code: 'xl'});
        logger.error(err);
    }
});

client.ws.on('INTERACTION_CREATE', async interaction => {
    const {token, member: {user}, id, guild_id, data, channel_id} = interaction;

    logger.info(`${channel_id} ${user.username}#${user.discriminator}: /${data.name}`);

    try {
        if (data.name === '8ball') {
            const response = [
                'It is certain.',
                'It is decidedly so.',
                'Without a doubt.',
                'Yes - definitely.',
                'You may rely on it.',
                'As I see it, yes.',
                'Most likely.',
                'Outlook good.',
                'Yes.',
                'Signs point to yes.',
                'Reply hazy, try again.',
                'Ask again later.',
                'Better not tell you now.',
                'Cannot predict now.',
                'Concentrate and ask again.',
                'Don\'t count on it.',
                'My reply is no.',
                'My sources say no.',
                'Outlook not so good.',
                'Very doubtful.'
            ];
            
            client.api
                .interactions(id)(token)
                .callback
                .post({data: {
                    type: 4,
                    data: {
                        content: 
                            `Question: ${data.options[0].value}\n` +
                            `Response: ${response[Math.floor(Math.random() * response.length)]}`
                    }
                }})
                .catch(err => logger.error(err));

        } else if (data.name === 'avatar') {
            const userID = data.options ? data.options[0].value : user.id;
            
            client.api
                .interactions(id)(token)
                .callback
                .post({data: {
                    type: 4,
                    data: {
                        content: client.users.cache.get(userID).displayAvatarURL().concat('?size=4096')
                    }
                }})
                .catch(err => logger.error(err));
        
        } else if (data.name === 'ban') {
            const author = client.guilds.cache.get(guild_id).members.cache.get(user.id);
            const member = client.guilds.cache.get(guild_id).members.cache.get(data.options[0].value);

            if (author.hasPermission('BAN_MEMBERS') === false) {
                client.api
                    .interactions(id)(token)
                    .callback
                    .post({data: {
                        type: 3,
                        data: {
                            flags: 64,
                            content: `<:red_x:717257458657263679> Error: \`DiscordAPIError: Missing Permissions\``
                        }
                    }})
                    .catch(err => logger.error(err));

            } else if (author.hasPermission('BAN_MEMBERS') === true) {
                let days = 0;
                let reason = undefined;
                let silent = false;
                let error = false;
                
                for (let i = 1; i < data.options.length; i++) {
                    switch (data.options[i].name) {
                        case 'delete':
                            days = data.options[i].value;
                            break;

                        case 'reason':
                            reason = data.options[i].value;
                            break;

                        case 'silent':
                            silent = data.options[i].value;
                            break;
                    }
                }

                await member.ban({days: days, reason: reason})
                    .catch((err) => {
                        logger.error(err);
                        
                        client.api
                            .interactions(id)(token)
                            .callback
                            .post({data: {
                                type: 3,
                                data: {
                                    flags: 64,
                                    content: `<:red_x:717257458657263679> Error: \`${err}\``
                                }
                            }})
                            .catch(err => logger.error(err));
                        
                        error = true;
                    });

                if (error === false) {
                    if (silent === false) {
                        client.api
                            .interactions(id)(token)
                            .callback
                            .post({data: {
                                type: 4,
                                data: {
                                    content: 
                                        `${member.toString()} ${member.user.tag} has been banned ` +
                                        `from the server for reason: \`${reason ? reason : 'None'}\``
                                }
                            }})
                            .catch(err => logger.error(err));
                    
                    } else if (silent === true) {
                        client.api
                            .interactions(id)(token)
                            .callback
                            .post({data: {
                                type: 3,
                                data: {
                                    flags: 64,
                                    content: 
                                        `${member.toString()} ${member.user.tag} has been banned ` +
                                        `from the server for reason: \`${reason ? reason : 'None'}\``
                                }
                            }})
                            .catch(err => logger.error(err));
                    }
                }
            }
            
        } else if (data.name === 'kick') {
            const author = client.guilds.cache.get(guild_id).members.cache.get(user.id);
            const member = client.guilds.cache.get(guild_id).members.cache.get(data.options[0].value);

            if (author.hasPermission('KICK_MEMBERS') === false) {
                client.api
                    .interactions(id)(token)
                    .callback
                    .post({data: {
                        type: 3,
                        data: {
                            flags: 64,
                            content: `<:red_x:717257458657263679> Error: \`DiscordAPIError: Missing Permissions\``
                        }
                    }})
                    .catch(err => logger.error(err));

            } else if (author.hasPermission('KICK_MEMBERS') === true) {
                let reason = undefined;
                let silent = false;
                let error = false;
                
                for (let i = 1; i < data.options.length; i++) {
                    switch (data.options[i].name) {
                        case 'reason':
                            reason = data.options[i].value;
                            break;

                        case 'silent':
                            silent = data.options[i].value;
                            break;
                    }
                }

                await member.kick(reason)
                    .catch((err) => {
                        logger.error(err);
                        
                        client.api
                            .interactions(id)(token)
                            .callback
                            .post({data: {
                                type: 3,
                                data: {
                                    flags: 64,
                                    content: `<:red_x:717257458657263679> Error: \`${err}\``
                                }
                            }})
                            .catch(err => logger.error(err));
                        
                        error = true;
                    });

                if (error === false) {
                    if (silent === false) {
                        client.api
                            .interactions(id)(token)
                            .callback
                            .post({data: {
                                type: 4,
                                data: {
                                    content: 
                                        `${member.toString()} ${member.user.tag} has been kicked ` +
                                        `from the server for reason: \`${reason ? reason : 'None'}\``
                                }
                            }})
                            .catch(err => logger.error(err));
                    
                    } else if (silent === true) {
                        client.api
                            .interactions(id)(token)
                            .callback
                            .post({data: {
                                type: 3,
                                data: {
                                    flags: 64,
                                    content: 
                                        `${member.toString()} ${member.user.tag} has been kicked ` +
                                        `from the server for reason: \`${reason ? reason : 'None'}\``
                                }
                            }})
                            .catch(err => logger.error(err));
                    }
                }
            }

        } else if (data.name === 'ping') {
            const start = Date.now()
            
            await client.api
                .interactions(id)(token)
                .callback
                .post({data: {
                    type: 4,
                    data: {
                        content: `Pinging...`
                    }
                }})
                .catch(err => logger.error(err));

            const end = Date.now()

            client.api
                .webhooks('681868362594123806')(token)
                .messages('@original')
                .patch({data: {
                    content: `Pong! Took **${end - start}**ms`
                }})
                .catch(err => logger.error(err));
        
        } else if (data.name === 'remind') {
            const time = data.options[2].value;

            switch (data.options[0].value) {
                case 'here':
                    channel = client.channels.cache.get(channel_id);
                    break;

                case 'me':
                    channel = await client.users.cache.get(user.id).createDM();
                    break;
            }

            if (data.options[1].value === 'date') {
                const date = Date.parse(time);
                timeout = date - Date.now();
            
            } else if (data.options[1].value === 'duration') {
                let hours = 0;
                let minutes = 0;
                let seconds = 0;

                time.split(' ').forEach(duration => {
                    switch (duration.charAt(duration.length - 1)) {
                        case 'h':
                            hours = duration.substring(0, duration.length - 1) * 60 * 60 * 1000;
                            break;

                        case 'm':
                            minutes = duration.substring(0, duration.length - 1) * 60 * 1000;
                            break;

                        case 's':
                            seconds = duration.substring(0, duration.length - 1) * 1000;
                            break;
                    }
                });

                timeout = hours + minutes + seconds;
            }

            if (isNaN(timeout)) {
                client.api
                    .interactions(id)(token)
                    .callback
                    .post({data: {
                        type: 3,
                        data: {
                            flags: 64,
                            content: `<:red_x:717257458657263679> Error: \`InputError: Invalid Time\``
                        }
                    }})
                    .catch(err => logger.error(err));

            } else {
                client.api
                    .interactions(id)(token)
                    .callback
                    .post({data: {
                        type: 4,
                        data: {
                            content: 
                                `Okay, I'll remind ${data.options[0].value === 'here' ? channel : 'you'} ` +
                                `about: \`${data.options[3].value}\` ` +
                                `${data.options[1].value === 'duration' ? `in: \`${time}\`` : `at: \`${time}\``}`
                        }
                    }})
                    .catch(err => logger.error(err));
                
                    setTimeout(() => {
                        channel.send(
                            `Hello ${client.users.cache.get(user.id).toString()}! You ` +
                            `asked me to remind you about: \`${data.options[3].value}\``);
                    
                    }, timeout);
            }

        } else if (data.name === 'server') {
            const guild = client.guilds.cache.get(guild_id);

            const notificationNames = {
                ALL: 'All Messages',
                MENTIONS: 'Only @mentions'
            };

            const verificationNames = {
                NONE: 'None',
                LOW: 'Low',
                MEDIUM: 'Medium',
                HIGH: 'High',
                VERY_HIGH: 'Highest'
            };

            const filterNames = {
                DISABLED: 'Don\'t scan any media content.',
                MEMBERS_WITHOUT_ROLES: 'Scan media content from members without a role.',
                ALL_MEMBERS: 'Scan media content from all members.'
            };

            let totalChannels = 0;
            let textChannels = 0;
            let voiceChannels = 0;
            let categoryChannels = 0;
            let announcementChannels = 0;
            let storeChannels = 0;

            guild.channels.cache.forEach((c) => {
                switch (c.type) {
                    case 'text':
                        textChannels++;
                        totalChannels++;
                        break;
                    
                    case 'voice':
                        voiceChannels++;
                        totalChannels++;
                        break;
                    
                    case 'category':
                        categoryChannels++;
                        totalChannels++;
                        break;

                    case 'news':
                        announcementChannels++;
                        totalChannels++;
                        break;
                    
                    case 'store':
                        storeChannels++;
                        totalChannels++;
                        break;
                }
            });

            let onlineMembers = 0;
            let idleMembers = 0;
            let dndMembers = 0;
            let offlineMembers = 0;
            let numMembers = 0;
            let numBots = 0;

            guild.members.cache.forEach((m) => {
                switch (m.user.presence.status) {
                    case 'online':
                        onlineMembers++;
                        break;
                    
                    case 'idle':
                        idleMembers++;
                        break;
                    
                    case 'dnd':
                        dndMembers++;
                        break;

                    case 'offline':
                        offlineMembers++;
                        break;
                }

                switch (m.user.bot) {
                    case false:
                        numMembers++;
                        break;

                    case true:
                        numBots++;
                        break;
                }
            });

            let features = [];
            const featrueNames = {
                ANIMATED_ICON: 'Animated Icon',
                BANNER: 'Banner',
                COMMERCE: 'Commerce',
                COMMUNITY: 'Community',
                DISCOVERABLE: 'Discoverable',
                FEATURABLE: 'Featurable',
                INVITE_SPLASH: 'Invite Splash',
                NEWS: 'News',
                PARTNERED: 'Partnered',
                RELAY_ENABLED: 'Relay Enabled',
                VANITY_URL: 'Vanity URL',
                VERIFIED: 'Verified',
                VIP_REGIONS: 'VIP Regions',
                WELCOME_SCREEN_ENABLED: 'Welcome Screen Enabled',
                PREVIEW_ENABLED: 'Preview Enabled',
                ENABLED_DISCOVERABLE_BEFORE: 'Enabled Discoverable Before',
                MEMBER_VERIFICATION_GATE_ENABLED: 'Member Verification Gate Enabled'
            };
            
            guild.features.length === 0 ? features.push('None') : guild.features.forEach(f => features.push(featrueNames[f]));
            
            client.api
                .interactions(id)(token)
                .callback
                .post({data: {
                    type: 4,
                    data: {
                        embeds: [{
                            title: `${guild.name}`,
                            description:
                                `Owner: ${guild.owner}\n`+
                                `System Channel: ${guild.systemChannel || '`None`'}\n`+
                                `ID: \`${guild.id}\`\n`+
                                `Created: \`${dateFormat(guild.createdAt, 'mmmm d, yyyy "at" h:MM TT Z')}\`\n`+
                                `Bot Joined: \`${dateFormat(guild.joinedAt, 'mmmm d, yyyy "at" h:MM TT Z')}\`\n`+
                                `Region: \`${guild.region}\`\n`+
                                `Partnered: \`${guild.partnered ? 'Yes' : 'No'}\`\n`+
                                `Verified: \`${guild.verified ? 'Yes' : 'No'}\`\n\n`+
                                `Vanity: \`${guild.vanityURLCode ? `discord.gg/${guild.vanityURLCode}` : 'None'}\`\n`+
                                `Banner: ${guild.bannerURL() ? `[\`Link\`](${guild.bannerURL({format: 'png', dynamic: true, size: 4096})})` : '`None`'}\n`+
                                `Splash: ${guild.splashURL() ? `[\`Link\`](${guild.splashURL({format: 'png', dynamic: true, size: 4096})})` : '`None`'}\n`+
                                `Icon: ${guild.iconURL() ? `[\`Link\`](${guild.iconURL({format: 'png', dynamic: true, size: 4096})})` : '`None`'}\n\n`+
                                `Rules or Guidelines Channel: ${guild.rulesChannel || '`None`'}\n`+
                                `Community Updates Channel: ${guild.publicUpdatesChannel || '`None`'}\n`+
                                `Primary Language: \`${guild.preferredLocale || '`None`'}\`\n\n`+
                                `Boosts: \`${guild.premiumSubscriptionCount} Boosts\`\n`+
                                `Boost Level: \`Tier ${guild.premiumTier}\`\n\n`+
                                `Verification Level: \`${verificationNames[guild.verificationLevel]}\`\n`+
                                `Default Notifications: \`${notificationNames[guild.defaultMessageNotifications]}\`\n`+
                                `Content Filter: \`${filterNames[guild.explicitContentFilter]}\`\n`+
                                `2FA Requirement: \`${guild.mfaLevel ? 'On' : 'Off'}\`\n\n`+
                                `Channels [\`${totalChannels} Total\`]:\n`+
                                `<:text:772577583648210965> \`${textChannels} Text Channels\`\n`+
                                `<:voice:772577600400392192> \`${voiceChannels} Voice Channels\`\n`+
                                `<:category:772577614157709363> \`${categoryChannels} Categories\`\n`+
                                `<:announcement:772577634571517952> \`${announcementChannels} Announcement Channels\`\n`+
                                `<:store:794645005398048808> \`${storeChannels} Store Channels\`\n\n`+
                                `<:emojis:773417353144172554> \`${guild.emojis.cache.array().length} Emojis\`\n`+
                                `<:roles:773418244140171324> \`${guild.roles.cache.array().length} Roles\`\n\n`+
                                `Members [\`${guild.memberCount} Total\`]:\n`+
                                `<:online:718302081399783573> \`${onlineMembers} Online\`\n`+
                                `<:idle:718302096096624741> \`${idleMembers} Idle\`\n`+
                                `<:dnd:718302130695438346> \`${dndMembers} Busy\`\n`+
                                `<:offline:718302145698594838> \`${offlineMembers} Offline\`\n\n`+
                                `<:member:772872418481930282> \`${numMembers} Members\`\n`+
                                `<:bot:772872483661414400> \`${numBots} Bots\`\n\n`+
                                `Features: \`${features.join(', ')}\``,
                            color: config.color,
                            thumbnail: {
                                url: guild.iconURL ? guild.iconURL({format: 'png', dynamic: true, size: 4096}) : 'https://ellie.is.gay/1eUNml2tV',
                            }
                        }]
                    }
                }})
                .catch(err => logger.error(err));

        } else if (data.name === 'user') {
            const member = client.guilds.cache.get(guild_id).members.cache.get(data.options ? data.options[0].value : user.id);
            const guild = client.guilds.cache.get(guild_id);

            const statusIcon = {
                online: '<:online:718302081399783573>', 
                idle: '<:idle:718302096096624741>',
                dnd: '<:dnd:718302130695438346>',
                offline: '<:offline:718302145698594838>'
            };

            const statusText = {
                online: 'Online',
                idle: 'Idle',
                dnd: 'Busy',
                offline: 'Offline'
            };

            const join = guild.members.cache.map(m => m.joinedTimestamp).sort((a, b) => a - b).indexOf(member.joinedTimestamp) + 1;

            const boost = member.premiumSince ? `Since ${dateFormat(member.premiumSince, 'mmmm d, yyyy "at" h:MM TT Z')}` : 'No';

            const icon = member.user.avatarURL() ? `[\`Link\`](${member.user.avatarURL({format: 'png', dynamic: true, size: 4096})})` : '`None`';

            let presence = '\n';
            member.presence.activities.length === 0 ? presence = '`None`\n' : member.presence.activities.forEach(p => {
                if (p.type === 'COMPETING') {
                    presence += `\n> Competing in **${p.name}**\n`;

                } else if (p.type === 'CUSTOM_STATUS') {
                    presence += `\n> **${p.emoji ? `${p.emoji} ` : ''}${p.state ? p.state : ''}**\n`;

                } else if (p.type === 'LISTENING') {
                    if (p.name !== 'Spotify') {
                        presence += `\n> Listneing to **${p.name}**`;
                    
                    } else if (p.name === 'Spotify') {
                        presence +=
                            `\n> Listening to **${p.name}**`+
                            `\n> **[${p.details}](https://open.spotify.com/track/${p.syncID})**`+
                            `\n> By ${p.state}`+
                            `\n> On ${p.assets.largeText}\n`;
                    }

                } else if (p.type === 'PLAYING') {
                    let duration;

                    if (p.timestamps) {
                        let ms = p.timestamps.end === null ? Date.now() - Date.parse(p.timestamps.start) : Date.parse(p.timestamps.end) - Date.now();

                        if (ms > 0) {
                            let h,m,s;

                            h = Math.floor(ms / 1000 / 60 / 60);
                            m = Math.floor((ms / 1000 / 60 / 60 - h) * 60);
                            s = Math.floor(((ms / 1000 / 60 / 60 - h) * 60 - m) * 60);

                            h < 10 ? h = '0' + h : h = h;
                            m < 10 ? m = '0' + m : m = m;
                            s < 10 ? s = '0' + s : s = s;

                            h === '00' ? duration = `\n> ${m}:${s} ${p.timestamps.end === null ? 'elapsed' : 'left'}` : duration = `\n> ${h}:${m}:${s} ${p.timestamps.end === null ? 'elapsed' : 'left'}`;
                        
                        } else {
                            duration = '\n> 00:00 left';
                        }
                    
                    } else if (!p.timestamps) {
                        duration = '';
                    }
                    
                    presence += 
                        `\n> Playing **${p.name}**`+
                        `${p.details ? '\n> ' + p.details : ''}`+
                        `${p.state ? '\n> ' + p.state : ''} ${p.party?.size ? `(${p.party.size[0]} of ${p.party.size[1]})` : ''}`+
                        `${duration}\n`;

                } else if (p.type === 'STREAMING') {
                    presence += `\n> Live on **${p.name}**`+
                    `\n> **[${p.details}](${p.url})**`+
                    `\n> Playing ${p.state}\n`;

                } else if (p.type === 'WATCHING') {
                    presence += `\n> Watching **${p.name}**\n`;
                }
            });

            const roles = member.roles.cache.sort((a, b) => b.position - a.position).array();

            let flags = [];
            const flagNames = {
                DISCORD_EMPLOYEE: 'Discord Employee',
                PARTNERED_SERVER_OWNER: 'Partnered Server Owner',
                DISCORD_PARTNER: 'Discord Partner',
                HYPESQUAD_EVENTS: 'HypeSquad Events',
                BUGHUNTER_LEVEL_1: 'Bug Hunter Level 1',
                HOUSE_BRAVERY: 'House Bravery',
                HOUSE_BRILLIANCE: 'House Brilliance',
                HOUSE_BALANCE: 'House Balance',
                EARLY_SUPPORTER: 'Early Supporter',
                TEAM_USER: 'Team User',
                SYSTEM: 'System',
                BUGHUNTER_LEVEL_2: 'Bug Hunter Level 2',
                VERIFIED_BOT: 'Verified Bot',
                EARLY_VERIFIED_DEVELOPER: 'Early Verified Bot Developer',
                VERIFIED_DEVELOPER: 'Verified Developer',
            };
            
            member.user.flags ? member.user.flags.toArray().forEach(f => flags.push(flagNames[f])) : flags.push('None');

            let perms = [];
            const permNames = {
                ADMINISTRATOR: 'Administrator',
                CREATE_INSTANT_INVITE: 'Create Invite',
                KICK_MEMBERS: 'Kick Members',
                BAN_MEMBERS: 'Ban Members',
                MANAGE_CHANNELS: 'Manage Channels',
                MANAGE_GUILD: 'Manage Server',
                ADD_REACTIONS: 'Add Reactions',
                VIEW_AUDIT_LOG: 'View Audit Log',
                PRIORITY_SPEAKER: 'Priority Speaker',
                STREAM: 'Video',
                VIEW_CHANNEL: 'View Channels',
                SEND_MESSAGES: 'Send Messages',
                SEND_TTS_MESSAGES: 'Send Text-to-Speak Messages',
                MANAGE_MESSAGES: 'Manage Messages',
                EMBED_LINKS: 'Embed Links',
                ATTACH_FILES: 'Attach Files',
                READ_MESSAGE_HISTORY: 'Read Message History',
                MENTION_EVERYONE: 'Mention @everyone, @here, and All Roles',
                USE_EXTERNAL_EMOJIS: 'Use External Emoji',
                VIEW_GUILD_INSIGHTS: 'View Server Insights',
                CONNECT: 'Connect',
                SPEAK: 'Speak',
                MUTE_MEMBERS: 'Mute Members',
                DEAFEN_MEMBERS: 'Deafen Members',
                MOVE_MEMBERS: 'Move Members',
                USE_VAD: 'Use Voice Activity',
                CHANGE_NICKNAME: 'Change Nickname',
                MANAGE_NICKNAMES: 'Manage Nicknames',
                MANAGE_ROLES: 'Manage Roles',
                MANAGE_WEBHOOKS: 'Manage Webhooks',
                MANAGE_EMOJIS: 'Manage Emojis',
            };

            member.hasPermission('ADMINISTRATOR') ? perms.push('Administrator') : member.permissions.toArray().forEach(p => perms.push(permNames[p]));
            
            client.api
                .interactions(id)(token)
                .callback
                .post({data: {
                    type: 4,
                    data: {
                        embeds: [{
                            title: `${member.user.tag}`,
                            description:
                                `Profile: ${member.toString()}\n`+
                                `ID: \`${member.id}\`\n`+
                                `Nick: \`${member.nickname || 'None'}\`\n`+
                                `Bot: \`${member.user.bot ? 'True' : 'False'}\`\n`+
                                `Status: ${statusIcon[member.user.presence.status]}\`${statusText[member.user.presence.status]}\`\n`+
                                `Created: \`${dateFormat(member.user.createdAt, 'mmmm d, yyyy "at" h:MM TT Z')}\`\n`+
                                `Joined: \`${dateFormat(member.joinedAt, 'mmmm d, yyyy "at" h:MM TT Z')}\`\n`+
                                `Activity: ${presence}\n`+
                                `Join Position: \`${join}\`\n`+
                                `Color: \`${member.displayHexColor}\`\n`+
                                `Booster: \`${boost}\`\n`+
                                `Icon: ${icon}\n\n`+
                                `Roles: ${roles.join(', ')}\n\n`+
                                `Flags: \`${flags.join(', ')}\`\n\n`+
                                `Permissions: \`${perms.join(', ')}\``,
                            color: config.color,
                            thumbnail: {
                                url: member.user.displayAvatarURL(),
                            }
                        }]
                    }
                }})
                .catch(err => logger.error(err));
        }
    
    } catch (err) {
        logger.error(err);
    }
});

client.login(config.token);
