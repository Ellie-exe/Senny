const { MessageEmbed } = require('discord.js');
const dateFormat = require('dateformat');
/**
 * Displays role information
 * @param {import('../utils').Interaction} command
 */
module.exports.execute = async (command) => {
    try {
        // Get the role
        const roleID = command.data.options[0].value;
        const role = command.client.guilds.cache.get(command.guildID).roles.cache.get(roleID);

        // Map raw names to formatted ones
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

        let perms = []; // List of the role's perms

        // Check if the role has admin
        switch (role.permissions.has('ADMINISTRATOR')) {
            // If it does have admin
            case true:
                // Add admin to the list and nothing else
                // Everything else is implied with admin
                perms.push('Administrator');
                break;

            // If the role doesn't have admin
            case false:
                // Format each perm and add it to the list
                role.permissions.toArray().forEach(p => perms.push(permNames[p]));
                break;
        }

        // Create the embed
        const embed = new MessageEmbed()
            .setAuthor(`${role.name} - Info`)
            .setDescription(
                `Name: \`${role.name}\`\n`+
                `ID: \`${role.id}\`\n`+
                `Created: \`${dateFormat(role.createdAt, 'mmmm d, yyyy "at" h:MM TT Z')}\`\n`+
                `Hoisted: \`${role.hoist ? 'Yes' : 'No'}\`\n`+
                `Managed: \`${role.managed ? 'yes' : 'No'}\`\n`+
                `Mentionable: \`${role.mentionable ? 'Yes' : 'No'}\`\n`+
                `Position: \`${role.position}\`\n`+
                `Members: \`${role.members.array().length}\`\n`+
                `Color: \`${role.hexColor}\`\n`+
                `Permissions: \`${perms.join(', ')}\``
            )
            .setColor(process.env.color);

        // Send the embed
        command.embed([embed]);

    } catch (err) {
        // Log any errors
        command.error(err);
    }
};
