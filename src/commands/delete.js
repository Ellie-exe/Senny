/**
 * @param {import('../../types').Interaction} command
 * @param {import('../../types').Utils} utils
 */
module.exports.execute = async (command, utils) => {
    try {
        const guildID = command.guildID
        const guild = command.client.guilds.cache.get(guildID);
        const author = await guild.members.fetch(command.user.id);
        const type = command.data.options[0].name;
        const options = command.data.options[0].options;

        switch (type) {
            case 'role': {
                if (await utils.check(author, guildID, {permissions: ['MANAGE_ROLES'], roles: ['admin']}) === false) {
                    throw new Error('Missing Permissions');
                }

                const role = guild.roles.cache.get(options[0].value);
                await role.delete();

                command.send(`Success! \`@${role.name}\` has been deleted`);
                break;
            }

            case 'channel': {
                if (await utils.check(author, guildID, {permissions: ['MANAGE_CHANNELS'], roles: ['admin']}) === false) {
                    throw new Error('Missing Permissions');
                }

                const channel = guild.channels.cache.get(options[0].value);
                await channel.delete();

                command.send(`Success! \`#${channel.name}\` has been deleted`);
                break;
            }
        }

    } catch (err) {
        command.send(`${utils.constants.emojis.redX} ${err.name}: \`${err.message}\``, {type: 3, flags: 64});
        utils.logger.error(err);
    }
};
