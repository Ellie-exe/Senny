/**
 * Gives a role to a member
 * @param {import('../utils').Interaction} command
 * @param {import('../utils')} utils
 */
module.exports.execute = async (command, utils) => {
    try {
        const guildID = command.guildID; // The current guild
        const memberID = command.data.options[0].value; // The member to give the role to
        const authorID = command.authorID; // The command author
        const roleID = command.data.options[1].value; // The role to give

        // Fetch the current guild, member, author, and role
        const guild = await command.client.guilds.fetch(guildID);
        const member = await guild.members.fetch(memberID);
        const author = await guild.members.fetch(authorID);
        const role = await guild.roles.fetch(roleID);

        // Check the author's perms
        if (await utils.check(author, guildID, {permissions: ['MANAGE_ROLES'], roles: ['admin']}) === false) {
            throw new Error('Missing Permissions');
        }

        // Add the role to the member and send a confirmation message
        await member.roles.add(role);
        command.send(`Success! \`${role.name}\` has been added to \`${member.displayName}\``);

    } catch (err) {
        // Log any errors
        command.error(err);
    }
};
