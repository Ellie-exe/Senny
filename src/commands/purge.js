module.exports = {
    /**
     * Mass purges messages from chat
     * @param {import('../utils').Interaction} command
     * @param {import('../utils')} utils
     */
    async execute(command, utils) {
        try {
            const guildID = command.guildID; // The current guild
            const channelID = command.channelID; // The current channel
            const authorID = command.authorID; // The command author
            const amount = command.data.options[0].value; // The number of messages to purge

            // Fetch the current guild, channel, and author
            const guild = await command.client.guilds.fetch(guildID);
            const channel = await guild.channels.fetch(channelID);
            const author = await guild.members.fetch(authorID);

            // Check the author's permissions
            if (await utils.check(author, guildID, {permissions: ['MANAGE_MESSAGES'], roles: ['admin', 'mod']}) === false) {
                throw new Error('Missing Permissions');
            }

            // Delete the specified number of channels and send an ephemeral confirmation message
            await channel.bulkDelete(amount);
            command.send(`${amount} messages have been deleted`, {type: 3, flags: 64});

        } catch (err) {
            // Log any errors
            command.error(err);
        }
    },

    // The data to register the command
    json: {
        name: 'purge',
        description: 'Mass purge messages from chat',
        options: [
            {
                name: 'amount',
                description: 'The amount of messages to purge',
                type: 4,
                required: true
            }
        ]
    }
};
