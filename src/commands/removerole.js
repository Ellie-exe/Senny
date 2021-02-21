/**
 * @param {import('../../types').Interaction} command
 * @param {import('../../types').Utils} utils
 */
module.exports.execute = async (command, utils) => {
    try {
        const guildID = command.guildID;
        const guild = command.client.guilds.cache.get(guildID);
        const author = await guild.members.fetch(command.authorID);
        const member = await guild.members.fetch(command.data.options[0].value);
        const role = guild.roles.cache.get(command.data.options[1].value);

        if (await utils.check(author, guildID, {permissions: ['MANAGE_ROLES'], roles: ['admin']}) === false) {
            throw new Error('Missing Permissions');
        }

        await member.roles.remove(role);
        command.send(`Success! \`${role.name}\` has been removed from \`${member.displayName}\``);

    } catch (err) {
        command.error(err);
    }
};