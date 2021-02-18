/**
 * @param {import('../../types').Interaction} command
 * @param {import('../../types').Utils} utils
 */
module.exports.execute = async (command, utils) => {
    try {
        const guildID = command.guildID;
        const guild = command.client.guilds.cache.get(guildID);
        const author = await guild.members.fetch(command.user.id);
        const type = command.data.options[0].name;
        const options = command.data.options[0].options;

        switch (type) {
            case 'role': {
                let roleOptions = {name: options[0].value};

                if (await utils.check(author, guildID, {permissions: ['MANAGE_ROLES'], roles: ['admin']}) === false) {
                    throw new Error('Missing Permissions');
                }

                for (const option in options) {
                    switch (options[option].name) {
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

                const role = await guild.roles.create(roleOptions);
                command.send(`Success! ${role} has been created`);
                break;
            }

            case 'channel': {
                const name = options[1].value;

                if (await utils.check(author, guildID, {permissions: ['MANAGE_CHANNELS'], roles: ['admin']}) === false) {
                    throw new Error('Missing Permissions');
                }

                switch (options[0].value) {
                    case 'text': {
                        let channelOptions = {type: 'text'};

                        for (const option in options) {
                            switch (options[option].name) {
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

                        const channel = await guild.channels.create(name, channelOptions);
                        command.send(`Success! ${channel} has been created`);
                        break;
                    }

                    case 'voice': {
                        let channelOptions = {type: 'voice'};

                        for (const option in options) {
                            switch (options[option].name) {
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

                        const channel = await guild.channels.create(name, channelOptions);
                        command.send(`Success! ${channel} has been created`);
                        break;
                    }

                    case 'category': {
                        let channelOptions = {type: 'category'};

                        for (const option in options) {
                            switch (options[option].name) {
                                case 'position':
                                    channelOptions['position'] = options[option].value;
                                    break;
                            }
                        }

                        const channel = await guild.channels.create(name, channelOptions);
                        command.send(`Success! ${channel} has been created`);
                        break;
                    }
                }

                break;
            }
        }

    } catch (err) {
        command.send(`${utils.constants.emojis.redX} ${err.name}: \`${err.message}\``, {type: 3, flags: 64});
        utils.logger.error(err);
    }
};
