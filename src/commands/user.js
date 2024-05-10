const { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } = require('discord.js');
const { logger } = require('../utils');

module.exports = {
    guildId: 'global',
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('Get information about a user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to get information about')),

    /** @param {ChatInputCommandInteraction} interaction */
    async execute(interaction) {
        try {
            const user = await interaction.options.getUser('user')?.fetch() || await interaction.user.fetch();
            const member = await interaction.guild.members.fetch(user.id);

            const embed = new EmbedBuilder()
                .setThumbnail(user.displayAvatarURL({dynamic: true}))
                .setAuthor({name: `${user.tag}`, iconURL: user.displayAvatarURL({dynamic: true})})
                .setColor(user.hexAccentColor)
                .addFields(
                    {
                        name: 'About',
                        value: `Mention: ${user.toString()}\n` +
                        `Created: <t:${Math.round(user.createdTimestamp / 1000)}:R>\n` +
                        member ? `Joined: <t:${Math.round(member.joinedTimestamp / 1000)}:R>` : ''
                    }
                );

            // if (member) {
            //     const permNames = {
            //         ADMINISTRATOR: 'Administrator',
            //         CREATE_INSTANT_INVITE: 'Create Invite',
            //         KICK_MEMBERS: 'Kick Members',
            //         BAN_MEMBERS: 'Ban Members',
            //         MANAGE_CHANNELS: 'Manage Channels',
            //         MANAGE_GUILD: 'Manage Server',
            //         ADD_REACTIONS: 'Add Reactions',
            //         VIEW_AUDIT_LOG: 'View Audit Log',
            //         PRIORITY_SPEAKER: 'Priority Speaker',
            //         STREAM: 'Video',
            //         VIEW_CHANNEL: 'View Channels',
            //         SEND_MESSAGES: 'Send Messages',
            //         SEND_TTS_MESSAGES: 'Send Text-to-Speak Messages',
            //         MANAGE_MESSAGES: 'Manage Messages',
            //         EMBED_LINKS: 'Embed Links',
            //         ATTACH_FILES: 'Attach Files',
            //         READ_MESSAGE_HISTORY: 'Read Message History',
            //         MENTION_EVERYONE: 'Mention @everyone, @here, and All Roles',
            //         USE_EXTERNAL_EMOJIS: 'Use External Emoji',
            //         VIEW_GUILD_INSIGHTS: 'View Server Insights',
            //         CONNECT: 'Connect',
            //         SPEAK: 'Speak',
            //         MUTE_MEMBERS: 'Mute Members',
            //         DEAFEN_MEMBERS: 'Deafen Members',
            //         MOVE_MEMBERS: 'Move Members',
            //         USE_VAD: 'Use Voice Activity',
            //         CHANGE_NICKNAME: 'Change Nickname',
            //         MANAGE_NICKNAMES: 'Manage Nicknames',
            //         MANAGE_ROLES: 'Manage Roles',
            //         MANAGE_WEBHOOKS: 'Manage Webhooks',
            //         MANAGE_EMOJIS_AND_STICKERS: 'Manage Emojis and Stickers',
            //         USE_APPLICATION_COMMANDS: 'Use Application Commands',
            //         REQUEST_TO_SPEAK: 'Request to Speak',
            //         MANAGE_THREADS: 'Manage Threads',
            //         CREATE_PUBLIC_THREADS: 'Create Public Threads',
            //         CREATE_PRIVATE_THREADS: 'Create Private Threads',
            //         USE_EXTERNAL_STICKERS: 'Use External Stickers',
            //         SEND_MESSAGES_IN_THREADS: 'Send Messages in Threads',
            //         START_EMBEDDED_ACTIVITIES: 'Start Activities'
            //     };
            //
            //     let perms = [];
            //     if (member.permissions.has('ADMINISTRATOR')) perms.push('Administrator');
            //     else member.permissions.toArray().forEach(p => { if (permNames[p]) perms.push(permNames[p]) });
            //
            //     const sortedRoles = member.roles.cache.sort((a, b) => b.position - a.position);
            //
            //     embed.setThumbnail(member.displayAvatarURL({ dynamic: true }))
            //         .addFields(
            //             {
            //                 name: `Roles [${member.roles.cache.size}]`,
            //                 value: sortedRoles.map(r => r.toString()).join(' ')
            //             },
            //             {
            //                 name: 'Permissions',
            //                 value: perms.length ? perms.join(', ') : 'None'
            //             }
            //         );
            // }

            await interaction.reply({embeds: [embed]});

        } catch (err) {
            logger.error(err);
        }
    }
};
