
module.exports = {
    /**
     * Edits a role or channel
     * @param {import('../utils').Interaction} command
     * @param {import('../utils')} utils
     */
    async execute(command, utils) {
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
    },

    // The data to register the command
    json: {
        name: 'edit',
        description: 'Edit a role or channel',
        options: [
            {
                name: 'role',
                description: 'Edit a role',
                type: 1,
                options: [
                    {
                        name: 'role',
                        description: 'The role to edit',
                        type: 8,
                        required: true
                    },
                    {
                        name: 'name',
                        description: 'The name of the role',
                        type: 3
                    },
                    {
                        name: 'color',
                        description: 'The color code of the role',
                        type: 3
                    },
                    {
                        name: 'hoist',
                        description: 'Whether the role is hoisted',
                        type: 5
                    },
                    {
                        name: 'position',
                        description: 'The position of the role',
                        type: 4
                    },
                    {
                        name: 'mentionable',
                        description: 'Whether the role can be mentioned',
                        type: 5
                    }
                ]
            },
            {
                name: 'channel',
                description: 'Edit a channel',
                type: 1,
                options: [
                    {
                        name: 'channel',
                        description: 'The channel to edit',
                        type: 7,
                        required: true
                    },
                    {
                        name: 'name',
                        description: 'The name of the channel',
                        type: 3
                    },
                    {
                        name: 'topic',
                        description: 'The topic of the text channel',
                        type: 3
                    },
                    {
                        name: 'nsfw',
                        description: 'Whether the text channel is nsfw',
                        type: 5
                    },
                    {
                        name: 'bitrate',
                        description: 'The bitrate of the voice channel',
                        type: 4
                    },
                    {
                        name: 'limit',
                        description: 'The user limit of the voice channel',
                        type: 4
                    },
                    {
                        name: 'parent',
                        description: 'The parent of the channel',
                        type: 7
                    },
                    {
                        name: 'position',
                        description: 'The position of the channel',
                        type: 4
                    },
                    {
                        name: 'slowmode',
                        description: 'The slowmode duration of the text channel',
                        type: 4
                    }
                ]
            }
        ]
    }
};
