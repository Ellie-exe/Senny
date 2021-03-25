module.exports = {
    /**
     * Kick a member from the guild
     * @param {import('../utils').Interaction} command
     * @param {import('../utils')} utils
     */
    async execute(command, utils) {
        try {
            const guildID = command.guildID; // The current guild
            const memberID = command.data.options[0].value; // The member to be kicked
            const authorID = command.authorID; // The command author
            const options = command.data.options; // The command options

            // Fetch the current guild, user, and author
            const guild = await command.client.guilds.fetch(guildID);
            const member = await guild.members.fetch(memberID);
            const author = await guild.members.fetch(authorID);

            // Default options to make them optional
            let reason = undefined;
            let silent = undefined;

            // Check the author's permissions
            if (await utils.check(author, guildID, {permissions: ['KICK_MEMBERS'], roles: ['admin', 'mod']}) === false) {
                throw new Error('Missing Permissions');
            }

            // For each option in the command options
            for (const option in options) {
                // Check the option name
                switch (options[option].name) {
                    // The reason for the kick
                    case 'reason':
                        reason = options[option].value;
                        break;

                    // Whether to send the message as ephemeral or not
                    case 'silent':
                        silent = 64;
                        break;
                }
            }

            // Kick the user and send a confirmation message, can be either a normal or ephemeral message
            await member.kick(reason);
            command.send(`${member.toString()} ${member.user.tag} has been kicked for reason: \`${reason || 'None'}\``, silent);

        } catch (err) {
            // Log any errors
            command.error(err);
        }
    },

    // The data to register the command
    json: {
        name: 'kick',
        description: 'Kick a user from the server',
        options: [
            {
                name: 'user',
                description: 'The user to kick',
                type: 6,
                required: true
            },
            {
                name: 'reason',
                description: 'The reason for the kick',
                type: 3
            },
            {
                name: 'silent',
                description: 'The confirmation message visibility',
                type: 5
            }
        ]
    }
};
