module.exports = {
    /**
     * @param {import('../utils').Interaction} command
     * @param {import('../utils')} utils
     */
    async execute(command, utils) {
        try {
            const options = command.data.options;
            const guild = command.client.guilds.cache.get(command.guildID);
            const member = await guild.members.fetch(command.data.options[0].value);
            const author = await guild.members.fetch(command.authorID);

            let reason = options.length === 2 ? options[1].value : undefined;

            if (await utils.check(author, guild.id, {permissions: ['KICK_MEMBERS'], roles: ['admin', 'mod']}) === false) {
                throw new Error('Missing Permissions');
            }

            await member.kick(reason);
            await command.send(`${member.toString()} ${member.user.tag} has been kicked for reason: \`${reason || 'None'}\``, 64);

        } catch (err) {
            await command.error(err);
        }
    },

    data: {
        name: 'kick',
        description: 'kick a server member',
        options: [
            {
                name: 'member',
                description: 'Member to kick',
                required: true,
                type: 6
            },
            {
                name: 'reason',
                description: 'Reason for kicking',
                type: 3
            }
        ]
    }
};
