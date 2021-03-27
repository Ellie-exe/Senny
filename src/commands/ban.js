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

            let days = 0;
            let reason = undefined;

            if (await utils.check(author, guild.id, {permissions: ['BAN_MEMBERS'], roles: ['admin', 'mod']}) === false) {
                throw new Error('Missing Permissions');
            }

            for (const option in options) {
                switch (options[option].name) {
                    case 'delete':
                        days = options[option].value;
                        break;

                    case 'reason':
                        reason = options[option].value;
                        break;
                }
            }

            await member.ban({days: days, reason: reason});
            await command.send(`${member.toString()} ${member.user.tag} has been banned for reason: \`${reason || 'None'}\``, 64);

        } catch (err) {
            await command.error(err);
        }
    },

    data: {
        name: 'ban',
        description: 'Ban a server member',
        options: [
            {
                name: 'member',
                description: 'Member to ban',
                required: true,
                type: 6
            },
            {
                name: 'days',
                description: 'Number of days of messages to delete',
                type: 4
            },
            {
                name: 'reason',
                description: 'Reason for banning',
                type: 3
            }
        ]
    }
};
