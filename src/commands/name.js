module.exports = {
    /**
     * @param {import('../utils').Interaction} command
     * @param {import('../utils')} utils
     */
    async execute(command, utils) {
        try {
            const guild = await command.client.guilds.fetch(command.guildID);
            const member = await guild.members.fetch(command.data.options[0].value);
            const author = await guild.members.fetch(command.authorID);
            
            let nick = null;

            if (await utils.check(author, guild.id, {permissions: ['MANAGE_NICKNAMES'], roles: ['admin', 'mod']}) === false) {
                throw new Error('Missing Permissions');
            }

            if (command.data.options[1]?.value !== undefined) nick = command.data.options[1].value;

            await member.setNickname(nick);
            await command.send(`${member.toString()}'s nickname has been set to: \`${nick || 'None'}\``, 64);

        } catch (err) {
            await command.error(err);
        }
    },

    data: {
        name: 'name',
        description: 'Change a member\'s nickname',
        options: [
            {
                name: 'member',
                description: 'Member to change',
                type: 6,
                required: true
            },
            {
                name: 'nick',
                description: 'Nickname to set',
                type: 3
            }
        ]
    }
};
