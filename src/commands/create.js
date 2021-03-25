module.exports = {
    /**
     * Create a role or channel
     * @param {import('../utils').Interaction} command
     * @param {import('../utils')} utils
     */
    async execute(command, utils) {
        try {
            const guildID = command.guildID; // The current guild
            const authorID = command.authorID; // The command author
            const type = command.data.options[0].name; // Either role or channel
            
            // Fetch the current guild and author
            const guild = await command.client.guilds.fetch(guildID);
            const author = await guild.members.fetch(authorID);

            // Check the type of thing to create
            switch (type) {
                // Create a role
                case 'role': {
                    // Creation options, name is a required option
                    let roleOptions = {name: options[0].value};

                    // Check the author's permissions
                    if (await utils.check(author, guildID, {permissions: ['MANAGE_ROLES'], roles: ['admin']}) === false) {
                        throw new Error('Missing Permissions');
                    }

                    // For each option
                    for (const option in options) {
                        // Check the option's name and add it to the list
                        switch (options[option].name) {
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

                    // Create the role and send a confirmation message
                    const role = await guild.roles.create(roleOptions);
                    command.send(`Success! ${role.name} has been created`);
                    command.edit(`Success! ${role} has been created`);
                    break;
                }

                // Create a channel
                case 'channel': {
                    // The name of the channel
                    const name = options[1].value;

                    // Check the author's permissions
                    if (await utils.check(author, guildID, {permissions: ['MANAGE_CHANNELS'], roles: ['admin']}) === false) {
                        throw new Error('Missing Permissions');
                    }

                    // Check the type of channel being created
                    switch (options[0].value) {
                        // Create a text channel
                        case 'text': {
                            // Creation options
                            let channelOptions = {type: 'text'};

                            // For each option
                            for (const option in options) {
                                // Check the option's name and add it to the list
                                switch (options[option].name) {
                                    // The channel topic
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

                                    // The position of the channel in the category
                                    case 'position':
                                        channelOptions['position'] = options[option].value;
                                        break;

                                    // The number of seconds of slowmode in the channel
                                    case 'slowmode':
                                        channelOptions['rateLimitPerUser'] = options[option].value;
                                        break;
                                }
                            }

                            // Create the channel and send a confirmation message
                            const channel = await guild.channels.create(name, channelOptions);
                            command.send(`Success! ${channel} has been created`);
                            break;
                        }

                        // Create a voice channel
                        case 'voice': {
                            // Creation options
                            let channelOptions = {type: 'voice'};

                            // For each options
                            for (const option in options) {
                                // Check the option's name and add it to the list
                                switch (options[option].name) {
                                    // The bitrate of the channel
                                    case 'bitrate':
                                        channelOptions['bitrate'] = options[option].value * 1000;
                                        break;

                                    // The number of people that can join the voice channel
                                    case 'limit':
                                        channelOptions['userLimit'] = options[option].value;
                                        break;

                                    // The category the channel is in
                                    case 'parent':
                                        channelOptions['parent'] = options[option].value;
                                        break;

                                    // The position of the channel in the category
                                    case 'position':
                                        channelOptions['position'] = options[option].value;
                                        break;
                                }
                            }

                            // Create the channel and send a confirmation message
                            const channel = await guild.channels.create(name, channelOptions);
                            command.send(`Success! ${channel} has been created`);
                            break;
                        }

                        // Create a category
                        case 'category': {
                            // Creation options
                            let channelOptions = {type: 'category'};

                            // For each option
                            for (const option in options) {
                                // Check the option's name and add it to the list
                                switch (options[option].name) {
                                    // The position of the category in the guild
                                    case 'position':
                                        channelOptions['position'] = options[option].value;
                                        break;
                                }
                            }

                            // Create the channel and send a confirmation message
                            const channel = await guild.channels.create(name, channelOptions);
                            command.send(`Success! ${channel} has been created`);
                            break;
                        }
                    }

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
        name: 'create',
        description: 'Create a role or channel',
        options: [
            {
                name: 'role',
                description: 'Create a role',
                type: 1,
                options: [
                    {
                        name: 'name',
                        description: 'The name of the role',
                        type: 3, 
                        required: true
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
                description: 'Create a channel',
                type: 1,
                options: [
                    {
                        name: 'type',
                        description: 'The type of channel to create',
                        type: 3,
                        required: true,
                        choices: [
                            {
                                name: 'text',
                                value: 'text'
                            },
                            {
                                name: 'voice',
                                value: 'voice'
                            },
                            {
                                name: 'category',
                                value: 'category'
                            }
                        ]
                    },
                    {
                        name: 'name',
                        description: 'The name of the channel',
                        type: 3, 
                        required: true
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
