module.exports = {
    /** @param {import('discord.js/typings').CommandInteraction} command */
    async execute(command) {
        try {
            const user = command.options.getUser('user') || command.user;
            const member = command.guild.members.cache.get(user.id);

            const embed = new discord.MessageEmbed()
                .setThumbnail(user.displayAvatarURL({dynamic: true}))
                .setAuthor(`${user.tag}`, user.displayAvatarURL({dynamic: true}))
                .setColor(0x2F3136)
                .addField(
                    'About',
                    `Mention: ${user.toString()}\n` +
                    `Created: <t:${Math.round(user.createdTimestamp / 1000)}:R>\n` +
                    `${member ? `Joined: <t:${Math.round(member.joinedTimestamp / 1000)}:R>` : ''}`
                );

            if (member) {
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
                    MANAGE_EMOJIS_AND_STICKERS: 'Manage Emojis and Stickers',
                    USE_APPLICATION_COMMANDS: 'Use Application Commands',
                    REQUEST_TO_SPEAK: 'Request to Speak',
                    MANAGE_THREADS: 'Manage Threads',
                    CREATE_PUBLIC_THREADS: 'Create Public Threads',
                    CREATE_PRIVATE_THREADS: 'Create Private Threads',
                    USE_EXTERNAL_STICKERS: 'Use External Stickers',
                    SEND_MESSAGES_IN_THREADS: 'Send Messages in Threads',
                    START_EMBEDDED_ACTIVITIES: 'Start Activities'
                };

                let perms = [];
                if (member.permissions.has('ADMINISTRATOR')) perms.push('Administrator');
                else member.permissions.toArray().forEach(p => {if (permNames[p]) perms.push(permNames[p])});

                const sortedRoles = member.roles.cache.sort((a, b) => b.position - a.position);

                embed.setColor(member.displayHexColor) // TODO: See if accent color works now
                    .setThumbnail(member.displayAvatarURL({dynamic: true}))
                    .addField(
                        `Roles [${member.roles.cache.size}]`,
                        `${sortedRoles.map(r => r.toString()).join(' ')}`
                    )
                    .addField(
                        `Permissions`,
                        `${perms.length ? perms.join(', ') : 'None'}`
                    );
            }

            await command.reply({embeds: [embed]});

        } catch (err) {
            logger.error(err);
        }
    },

    data: [
        {
            type: 'CHAT_INPUT',
            name: 'user',
            description: 'Get a user\'s info',
            options: [
                {
                    type: 'USER',
                    name: 'user',
                    description: 'The user to get info on'
                }
            ]
        },
        {
            type: 'USER',
            name: 'user'
        }
    ],

    flags: {
        developer: false
    }
};
