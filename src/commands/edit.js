/**
 * Edits a role or channel
 * @param {import('../utils').Interaction} command
 * @param {import('../utils')} utils
 */
module.exports.execute = async (command, utils) => {
    try {
        const guildID = command.guildID; // The current guild
        const authorID = command.authorID; // The command author
        const type = command.data.options[0].name; // Either role or channel
        const options = command.data.options[0].options; // The edit options
        
        // Fetch the current guild and author
        const guild = await command.client.guilds.fetch(guildID);
        const author = await guild.members.fetch(authorID);

        // Check the type of thing to edit
        switch (type) {
            // If we're editing a role
            case 'role': {
                // Get the role
                const role = guild.roles.cache.get(options[0].value);
                let roleOptions = {}; // The edit options

                // Check the author's perms
                if (await utils.check(author, guildID, {permissions: ['MANAGE_ROLES'], roles: ['admin']}) === false) {
                    throw new Error('Missing Permissions');
                }

                // For each option
                for (const option in options) {
                    // Check the option's name and add it to the list
                    switch (options[option].name) {
                        // The name of the role
                        case 'name':
                            roleOptions['name'] = options[option].value;
                            break;

                        // The color of the role
                        case 'color':
                            roleOptions['color'] = options[option].value;
                            break;

                        // Whether the role is hoisted or not
                        case 'hoist':
                            roleOptions['hoist'] = options[option].value;
                            break;

                        // The position of the role in the guild's role list
                        case 'position':
                            roleOptions['position'] = options[option].value;
                            break;

                        // Whether the role is mentionable or not
                        case 'mentionable':
                            roleOptions['mentionable'] = options[option].value;
                            break;
                    }
                }

                // Edit the role and send a confirmation message
                const newRole = await role.edit(roleOptions);
                await command.send(`Success! ${newRole.name} has been edited`);
                await command.edit(`Success! ${newRole} has been edited`);
                break;
            }

            // If we're editing a channel
            case 'channel': {
                // Get the channel
                const channel = guild.channels.cache.get(options[0].value);
                let channelOptions = {type: channel.type}; // The edit options

                // Check the author's permissions
                if (await utils.check(author, guildID, {permissions: ['MANAGE_CHANNELS'], roles: ['admin']}) === false) {
                    throw new Error('Missing Permissions');
                }

                // For each option
                for (const option in options) {
                    // Check the option's name and add it to the list
                    switch (options[option].name) {
                        // The channel's name
                        case 'name':
                            channelOptions['name'] = options[option].value;
                            break;

                        // The channel's topic
                        case 'topic':
                            channelOptions['topic'] = options[option].value;
                            break;

                        // The nsfw setting of the channel
                        case 'nsfw':
                            channelOptions['nsfw'] = options[option].value;
                            break;

                        // The category the channel is in
                        case 'parent':
                            channelOptions['parent'] = options[option].value;
                            break;

                        // The position of the channel within the category
                        case 'position':
                            channelOptions['position'] = options[option].value;
                            break;

                        // The number of seconds of slowmode in the channel
                        case 'slowmode':
                            channelOptions['rateLimitPerUser'] = options[option].value;
                            break;

                        // The bitrate of the voice channel
                        case 'bitrate':
                            channelOptions['bitrate'] = options[option].value * 1000;
                            break;

                        // The number of people that can join a voice channel
                        case 'limit':
                            channelOptions['userLimit'] = options[option].value;
                            break;
                    }
                }

                // Edit the channel and send a confirmation message
                const newChannel = await channel.edit(channelOptions);
                command.send(`Success! ${newChannel} has been created`);
                break;
            }
        }

    } catch (err) {
        // Log any errors
        command.error(err);
    }
};
