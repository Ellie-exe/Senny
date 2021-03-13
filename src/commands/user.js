const { MessageEmbed } = require('discord.js');
const dateFormat = require('dateformat');
/**
 * Displays user and member information
 * @param {import('../utils').Interaction} command
 */
module.exports.execute = async (command) => {
    try {
        const options = {format: 'png', dynamic: true, size: 4096}; // Image URL options

        // Get the guild the command was run in
        const guildID = command.guildID;
        const guild = command.client.guilds.cache.get(guildID);

        // If no member is provided, use the command author
        const memberID = command.data.options ? command.data.options[0].value : command.userID;
        const member = await command.client.guilds.cache.get(guildID).members.fetch(memberID);

        // Map status text to emojis
        const statusIcon = {
            online: '<:online:718302081399783573>',
            idle: '<:idle:718302096096624741>',
            dnd: '<:dnd:718302130695438346>',
            offline: '<:offline:718302145698594838>'
        };

        // Map status text to formatted text
        const statusText = {
            online: 'Online',
            idle: 'Idle',
            dnd: 'Busy',
            offline: 'Offline'
        };

        // Get all members' join timestamps and from oldest to newest so we can see where the member fits in
        const join = guild.members.cache.map(m => m.joinedTimestamp).sort((a, b) => a - b).indexOf(member.joinedTimestamp) + 1;

        // Format boost info so it also displays the date when someone is boosting
        const boost = member.premiumSince ? `Since ${dateFormat(member.premiumSince, 'mmmm d, yyyy "at" h:MM TT Z')}` : 'No';

        // Format the user's avatat url so it is a pretty link if it's not a default avatar
        const icon = member.user.avatarURL() ? `[\`Link\`](${member.user.avatarURL(options)})` : '`None`';

        // For each of the user's activities, add them to a formatted string, or set to "None"
        let activities = '\n';
        member.presence.activities.length === 0 ? activities = '`None`\n' : member.presence.activities.forEach(activity => {
            switch (activity.type) {
                // If the user is competing
                // This is only for bots
                case 'COMPETING': {
                    // Add activity to main string
                    activities += `\nCompeting in **${activity.name}**\n`;
                    break;
                }

                // If the user has a custom status set
                case 'CUSTOM_STATUS': {
                    // Add status to main string
                    // Status can be either just an emoji or just text or both
                    activities += `\n${activity.emoji || ''} ${activity.state || ''}\n`;
                    break;
                }

                // If the user is listening to something
                // Unless the user is a bot I believe this only applie to Spotify
                case 'LISTENING': {
                    // If it is a bot's status then add it here
                    if (activity.name !== 'Spotify') {
                        activities += `\nListening to **${activity.name}**\n`;

                    // If the activity is Spotify then format it like it is in Discord and add it
                    } else {
                        activities +=
                            `\nListening to **${activity.name}**`+
                            `\n**[${activity.details}](https://open.spotify.com/track/${activity.syncID})**`+
                            `\nBy ${activity.state}`+
                            `\nOn ${activity.assets.largeText}\n`;
                    }

                    break;
                }

                // If the user is playing a game
                // This is often used for custom RPC status'
                case 'PLAYING': {
                    // Making duration an empty string make the embed ignore the line if there is no duration to set
                    let duration = '';

                    // Timestamps vary a ton between activites
                    if (activity.timestamps) {
                        // If there is an ending timestamp it means it counts down not up
                        const time = activity.timestamps;
                        const ms = time.end === null ? Date.now() - Date.parse(time.start) : Date.parse(time.end) - Date.now();
                        const type = time.end === null ? 'elapsed' : 'left';

                        // If there is still time, format it
                        if (ms > 0) {
                            let h;
                            let m;
                            let s;

                            // Converts duration into hours, minutes, and seconds
                            h = Math.floor(ms / 1000 / 60 / 60);
                            m = Math.floor((ms / 1000 / 60 / 60 - h) * 60);
                            s = Math.floor(((ms / 1000 / 60 / 60 - h) * 60 - m) * 60);

                            // Zero pads hours
                            h < 10 ? h = '0' + h : h = h;
                            m < 10 ? m = '0' + m : m = m;
                            s < 10 ? s = '0' + s : s = s;

                            // Only show hours if they exist
                            h === '00' ? duration = `\n${m}:${s} ${type}` : duration = `\n${h}:${m}:${s} ${type}`;

                        } else {
                            // Format no time left the same as Discord
                            duration = '\n00:00 left';
                        }
                    }

                    // Because party size only applies when there is a party, a special check is needed
                    let party = '';
                    switch (!activity.party?.size) {
                        case false: {
                            // This check is needed because there is no way to check for size when party doesn't exist
                            party = `(${activity.party.size[0]} of ${activity.party.size[1]})`;
                            break;
                        }
                    }

                    // Finally actually add the activity
                    activities +=
                        `\nPlaying: **${activity.name}**`+
                        `${activity.details ? `\n${activity.details}` : ''}`+
                        `${activity.state ? `\n${activity.state}` : ''} ${party}`+
                        `${duration}\n`;

                    break;
                }

                // If the user is streaming, usually to Twitch
                case 'STREAMING': {
                    // Add the activity
                    activities +=
                        `\nLive on **${activity.name}**`+
                        `\n**[${activity.details}](${activity.url})**`+
                        `\nPlaying ${activity.state}\n`;

                    break;
                }

                // If the user is watching something
                // This is only for bots
                case 'WATCHING': {
                    // Add the activity
                    activities += `\nWatching **${activity.name}**\n`;
                    break;
                }
            }
        });

        // Get and sort the user's roles, for some reason they are not sorted by default
        const roles = member.roles.cache.sort((a, b) => b.position - a.position).array();

        // Map raw flag names to prettier ones
        const flagNames = {
            DISCORD_EMPLOYEE: 'Discord Employee',
            PARTNERED_SERVER_OWNER: 'Partnered Server Owner',
            HYPESQUAD_EVENTS: 'HypeSquad Events',
            BUGHUNTER_LEVEL_1: 'Discord Bug Hunter Level 1',
            HOUSE_BRAVERY: 'HypeSquad Bravery',
            HOUSE_BRILLIANCE: 'HypeSquad Billiance',
            HOUSE_BALANCE: 'HypeSquad Balance',
            EARLY_SUPPORTER: 'Early Supporter',
            TEAM_USER: 'Team User',
            SYSTEM: 'System',
            BUGHUNTER_LEVEL_2: 'Discord Bug Hunter Level 2',
            VERIFIED_BOT: 'Verified Bot',
            EARLY_VERIFIED_BOT_DEVELOPER: 'Early Verified Bot Developer'
        }

        // Flags can either be undefined or null, meaning they need a special handler
        let flags = [];
        switch (member.user.flags?.equals(0)) {
            // If the user has no flags
            case undefined:
                flags.push('None');
                break;

            // If the user's flags equals 0
            case true:
                flags.push('None');
                break;

            // If the user has flags
            default:
                // Push each flag through the formatting map before adding them to the list
                member.user.flags.toArray().forEach(flag => flags.push(flagNames[flag]));
        }

        // Map raw permission names with prettier ones
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

        // Check the user's perms
        let perms = [];
        switch (member.hasPermission('ADMINISTRATOR')) {
            // If the user has the admin perm
            case true:
                // Only add the admin perm, all other perms are implied
                perms.push('Administrator');
                break;

            // If the user does not have the admin perm
            case false:
                // Push each perm through the formatting map before adding them to the list
                member.permissions.toArray().forEach(p => perms.push(permNames[p]));
                break;
        }

        // Construct the embed
        const embed = new MessageEmbed()
            .setAuthor(`${member.user.tag} - Information`, null, member.user.avatarURL())
            .setDescription(
                `Profile: ${member.toString()}\n`+
                `ID: \`${member.id}\`\n`+
                `Nick: \`${member.nickname || 'None'}\`\n`+
                `Bot: \`${member.user.bot ? 'True' : 'False'}\`\n`+
                `Status: ${statusIcon[member.user.presence.status]}\`${statusText[member.user.presence.status]}\`\n`+
                `Created: \`${dateFormat(member.user.createdAt, 'mmmm d, yyyy "at" h:MM TT Z')}\`\n`+
                `Joined: \`${dateFormat(member.joinedAt, 'mmmm d, yyyy "at" h:MM TT Z')}\`\n`+
                `Activity: ${activities}\n`+
                `Join Position: \`${join}\`\n`+
                `Color: \`${member.displayHexColor}\`\n`+
                `Booster: \`${boost}\`\n`+
                `Icon: ${icon}\n\n`+
                `Roles: ${roles.join(', ')}\n\n`+
                `Flags: \`${flags.join(', ')}\`\n\n`+
                `Permissions: \`${perms.join(', ')}\``
            )
            .setColor(process.env.color)
            .setThumbnail(member.user.displayAvatarURL(options));

        // Send the embed
        command.embed([embed]);

    } catch (err) {
        // Log any errors
        command.error(err);
    }
};
