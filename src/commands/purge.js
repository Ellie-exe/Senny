module.exports = {
    /**
     * @param {import('../utils').Interaction} command
     * @param {import('../utils')} utils
     */
    async execute(command, utils) {
        try {
            const guildID = command.guildID;
            const channelID = command.channelID;
            const authorID = command.authorID;
            const amount = command.data.options[0].value;

            const guild = command.client.guilds.cache.get(guildID);
            const channel = guild.channels.cache.get(channelID);
            const author = await guild.members.fetch(authorID);

            if (await utils.check(author, guildID, {permissions: ['MANAGE_MESSAGES'], roles: ['admin', 'mod']}) === false) {
                throw new Error('Missing Permissions');
            }

            await channel.bulkDelete(amount);
            await command.send(`${amount} messages have been deleted`, 64);

        } catch (err) {
            await command.error(err);
        }
    },

    data: {
        name: 'purge',
        description: 'Purge messages from chat',
        options: [
            {
                name: 'amount',
                description: 'Number of messages to purge',
                required: true,
                type: 4
            }
        ]
    }
};
