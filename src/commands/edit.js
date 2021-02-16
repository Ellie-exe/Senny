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
                command.send(`Success! ${newRole} has been edited`);
                break;
            }

            case 'channel': {
                const channel = guild.channels.cache.get(options[0].value);
                let channelOptions = {type: channel.type};

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

                        case 'position':
                            channelOptions['position'] = options[option].value;
                            break;
                    }     
                }

                const newChannel = await channel.edit(channelOptions);
                command.send(`Success! ${newChannel} has been created`);
                break;
            }
        }
    
    } catch (err) {
        command.send(`${utils.constants.emojis.redX} ${err.name}: \`${err.message}\``, {type: 3, flags: 64});
        utils.logger.error(err);
    }
};