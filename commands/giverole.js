/**
 * @param {import('../types').Interaction} command
 * @param {import('../types').Utils} utils
 */
module.exports.execute = async (command, utils) => {
    try {
        const guildID = command.guildID;
        const guild = command.client.guilds.cache.get(guildID);
        const author = await guild.members.fetch(command.user.id);
        const member = await guild.members.fetch(command.data.options[0].value);
        const role = guild.roles.cache.get(command.data.options[1].value);

        if (!author.hasPermission('MANAGE_ROLES') && !utils.isAdmin(author, guildID)) {
            throw new Error('Missing Permissions');
        }

        await member.roles.add(role);
        command.send(`Success! \`${role.name}\` has been added to \`${member.displayName}\``);

    } catch (err) {
        command.send(`${utils.constants.emojis.redX} Error: \`${err}\``, {type: 3, flags: 64});
        utils.logger.error(err);
    }
};