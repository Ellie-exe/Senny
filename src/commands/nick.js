/**
 * Changes a user's nickname
 * @param {import('../utils').Interaction} command
 * @param {import('../utils')} utils
 */
module.exports.execute = async (command, utils) => {
    try {
        const memberID = command.data.options[0].value; // The user to edit
        const authorID = command.authorID; // The command author
        const guildID = command.guildID; // The current guild

        let nick = null; // Default the nickname

        // Fetch the current guild, user, and author
        const guild = await command.client.guilds.fetch(guildID);
        const member = await guild.members.fetch(memberID);
        const author = await guild.members.fetch(authorID);

        // Check the author's permissions
        if (await utils.check(author, guildID, {permissions: ['MANAGE_NICKNAMES'], roles: ['admin', 'mod']}) === false) {
            throw new Error('Missing Permissions');
        }

        // If a nick name has been provided, use that
        if (command.data.options[1]?.value !== undefined) nick = command.data.options[1].value;

        // Set the user's nickname and send a confirmation message
        await member.setNickname(nick);
        command.send(`${member.toString()}'s nickname has been set to: \`${nick || 'None'}\``);

    } catch (err) {
        // Log any errors
        command.error(err);
    }
};
