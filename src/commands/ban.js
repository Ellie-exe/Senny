/**
 * Bans a member from the guild
 * @param {import('../utils').Interaction} command
 * @param {import('../utils')} utils
 */
module.exports.execute = async (command, utils) => {
    try {
        const guildID = command.guildID; // The current guild
        const memberID = options[0].value; // The member to ban
        const authorID = command.authorID; // The command author
        const options = command.data.options; // The ban options

        // Fetch the current guild, member, and author
        const guild = await command.client.guilds.fetch(guildID);
        const member = await guild.members.fetch(memberID);
        const author = await guild.members.fetch(authorID);

        // Default options to make them optional
        let days = 0;
        let reason = undefined;
        let silent = undefined;

        // Check the author's permissions
        if (await utils.check(author, guildID, {permissions: ['BAN_MEMBERS'], roles: ['admin', 'mod']}) === false) {
            throw new Error('Missing Permissions');
        }

        // For each option in the command options
        for (const option in options) {
            // Check the option name
            switch (options[option].name) {
                // The number of day's worth of messages to delete
                case 'delete':
                    days = options[option].value;
                    break;

                // The reason for the ban
                case 'reason':
                    reason = options[option].value;
                    break;

                // Whether to send the message as ephemeral or not
                case 'silent':
                    silent = {type: 3, flags: 64};
                    break;
            }
        }

        // Ban the user and send a confirmation message, can be either a normal or ephemeral message
        await member.ban({days: days, reason: reason});
        command.send(`${member.toString()} ${member.user.tag} has been banned for reason: \`${reason || 'None'}\``, silent);

    } catch (err) {
        // Log any errors
        command.error(err);
    }
};
