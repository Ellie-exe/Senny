module.exports = {
    /**
     * @param {import('../utils').Interaction} command
     * @param {import('../utils')} utils
     */
    async execute(command, utils) {
        try {
            const guildID = command.guildID;
            const option = command.data.options[0].name;
            
            const guild = command.client.guilds.cache.get(guildID);
            const author = await guild.members.fetch(command.authorID);

            switch (option) {
                case 'role': {
                    const options = command.data.options[0].options;
                    const role = guild.roles.cache.get(options[0].value);

                    let roleOptions = {};

                    if (await utils.check(author, guildID, {permissions: ['MANAGE_ROLES'], roles: ['admin']}) === false) {
                        throw new Error('Missing Permissions');
                    }

                    for (const option in options) {
                        switch (options[option].name) {
                            case 'name':
                                roleOptions['name'] = options[option].value;
                                break;

                            case 'color':
                                roleOptions['color'] = options[option].value;
                                break;

                            case 'hoist':
                                roleOptions['hoist'] = options[option].value;
                                break;

                            case 'position':
                                roleOptions['position'] = options[option].value;
                                break;

                            case 'mentionable':
                                roleOptions['mentionable'] = options[option].value;
                                break;
                        }
                    }

                    const newRole = await role.edit(roleOptions);
                    await command.send(`**Success!** ${newRole} has been edited`, 64);
                    break;
                }

                case 'text': {
                    const channel = guild.channels.cache.get(options[0].value);
                    const options = command.data.options[0].options;
                    let channelOptions = {type: 'text'};

                    if (await utils.check(author, guildID, {permissions: ['MANAGE_CHANNELS'], roles: ['admin']}) === false) {
                        throw new Error('Missing Permissions');
                    }
        
                    for (const option in options) {
                        switch (options[option].name) {
                            case 'name':
                                channelOptions['name'] = options[option].value;
                                break;

                            case 'topic':
                                channelOptions['topic'] = options[option].value;
                                break;

                            case 'nsfw':
                                channelOptions['nsfw'] = options[option].value;
                                break;

                            case 'parent':
                                channelOptions['parent'] = options[option].value;
                                break;

                            case 'position':
                                channelOptions['position'] = options[option].value;
                                break;

                            case 'slowmode':
                                channelOptions['rateLimitPerUser'] = options[option].value;
                                break;
                        }
                    }

                    const newChannel = await channel.edit(channelOptions);
                    await command.send(`**Success!** ${newChannel} has been created`, 64);
                    break;
                }

                case 'voice': {
                    const channel = guild.channels.cache.get(options[0].value);
                    const options = command.data.options[0].options;
                    let channelOptions = {type: 'voice'};

                    if (await utils.check(author, guildID, {permissions: ['MANAGE_CHANNELS'], roles: ['admin']}) === false) {
                        throw new Error('Missing Permissions');
                    }
        
                    for (const option in options) {
                        switch (options[option].name) {
                            case 'name':
                                channelOptions['name'] = options[option].value;
                                break;

                            case 'bitrate':
                                channelOptions['bitrate'] = options[option].value * 1000;
                                break;

                            case 'limit':
                                channelOptions['userLimit'] = options[option].value;
                                break;

                            case 'parent':
                                channelOptions['parent'] = options[option].value;
                                break;

                            case 'position':
                                channelOptions['position'] = options[option].value;
                                break;
                        }
                    }

                    const newChannel = await channel.edit(channelOptions);
                    await command.send(`**Success!** ${newChannel} has been created`, 64);
                    break;
                }

                case 'category': {
                    const channel = guild.channels.cache.get(options[0].value);
                    const options = command.data.options[0].options;
                    let channelOptions = {type: 'category'};

                    if (await utils.check(author, guildID, {permissions: ['MANAGE_CHANNELS'], roles: ['admin']}) === false) {
                        throw new Error('Missing Permissions');
                    }
        
                    for (const option in options) {
                        switch (options[option].name) {
                            case 'name':
                                channelOptions['name'] = options[option].value;
                                break;

                            case 'position':
                                channelOptions['position'] = options[option].value;
                                break;
                        }
                    }

                    const newChannel = await channel.edit(channelOptions);
                    await command.send(`**Success!** ${newChannel} has been created`, 64);
                    break;
                }
            }

        } catch (err) {
            await command.error(err);
        }
    },

    data: {
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
                        description: 'Role to edit',
                        required: true,
                        type: 8
                    },
                    {
                        name: 'name',
                        description: 'Name of role',
                        type: 3
                    },
                    {
                        name: 'color',
                        description: 'Color of role',
                        type: 3
                    },
                    {
                        name: 'hoist',
                        description: 'Set hoist toggle',
                        type: 5
                    },
                    {
                        name: 'position',
                        description: 'Position of role',
                        type: 4
                    },
                    {
                        name: 'mentionable',
                        description: 'Set mentionable toggle',
                        type: 5
                    }
                ]
            },
            {
                name: 'text',
                description: 'Edit a text channel',
                type: 1,
                options: [
                    {
                        name: 'channel',
                        description: 'Channel to edit',
                        required: true,
                        type: 7
                    },
                    {
                        name: 'name',
                        description: 'Name of channel',
                        type: 3
                    },
                    {
                        name: 'topic',
                        description: 'Topic of channel',
                        type: 3
                    },
                    {
                        name: 'nsfw',
                        description: 'Set NSFW toggle',
                        type: 5
                    },
                    {
                        name: 'parent',
                        description: 'Set parent category',
                        type: 7
                    },
                    {
                        name: 'position',
                        description: 'Position of channel',
                        type: 4
                    },
                    {
                        name: 'slowmode',
                        description: 'Slowmode duration of channel',
                        type: 4
                    }
                ]
            },
            {
                name: 'voice',
                description: 'Create a voice channel',
                type: 1,
                options: [
                    {
                        name: 'channel',
                        description: 'Channel to edit',
                        required: true,
                        type: 7
                    },
                    {
                        name: 'name',
                        description: 'Name of channel',
                        type: 3
                    },
                    {
                        name: 'bitrate',
                        description: 'Bitrate of channel',
                        type: 4
                    },
                    {
                        name: 'limit',
                        description: 'Maximum number of members',
                        type: 4
                    },
                    {
                        name: 'parent',
                        description: 'Set parent category',
                        type: 7
                    },
                    {
                        name: 'position',
                        description: 'Position of channel',
                        type: 4
                    }
                ]
            },
            {
                name: 'category',
                description: 'Create a category',
                type: 1,
                options: [
                    {
                        name: 'channel',
                        description: 'Category to edit',
                        required: true,
                        type: 7
                    },
                    {
                        name: 'name',
                        description: 'Name of category',
                        type: 3
                    },
                    {
                        name: 'position',
                        description: 'Position of category',
                        type: 4
                    }
                ]
            }
        ]
    }
};
