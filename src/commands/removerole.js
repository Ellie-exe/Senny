/**
 * Removes a role from a member
 * @param {import('../../types').Interaction} command
 * @param {import('../../types').Utils} utils
 */
module.exports.execute = async (command, utils) => {
    try {
        // Get the current guild
        const guildID = command.guildID;
        const guild = command.client.guilds.cache.get(guildID);

        // Get the author and the member to add a role to
        const author = await guild.members.fetch(command.authorID);
        const member = await guild.members.fetch(command.data.options[0].value);

        // Get the role to add
        const role = guild.roles.cache.get(command.data.options[1].value);

        // Check the author's permissions
        if (await utils.check(author, guildID, {permissions: ['MANAGE_ROLES'], roles: ['admin']}) === false) {
            throw new Error('Missing Permissions');
        }

        // Remove the role and send a confirmation message
        await member.roles.remove(role);
        command.send(`Success! \`${role.name}\` has been removed from \`${member.displayName}\``);

    } catch (err) {
        // Log any errors
        command.error(err);
    }
};
