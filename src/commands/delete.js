module.exports = {
    /**
     * @param {import('../utils').Interaction} command
     * @param {import('../utils')} utils
     */
    async execute(command, utils) {
        try {
            const guildID = command.guildID;
            const options = command.data.options[0];
            
            const guild = command.client.guilds.cache.get(guildID);
            const author = await guild.members.fetch(command.authorID);

            switch (options.name) {
                case 'role': {
                    if (await utils.check(author, guildID, {permissions: ['MANAGE_ROLES'], roles: ['admin']}) === false) {
                        throw new Error('Missing Permissions');
                    }

                    const role = guild.roles.cache.get(options.value);
                    await role.delete();

                    await command.send(`**Success!** \`${role.name}\` has been deleted`, 64);
                    break;
                }

                case 'channel': {
                    if (await utils.check(author, guildID, {permissions: ['MANAGE_CHANNELS'], roles: ['admin']}) === false) {
                        throw new Error('Missing Permissions');
                    }

                    const channel = guild.channels.cache.get(options.value);
                    await channel.delete();

                    await command.send(`**Success!** \`${channel.name}\` has been deleted`, 64);
                    break;
                }
            }

        } catch (err) {
            await command.error(err);
        }
    },

    data: {
        name: 'delete',
        description: 'Delete a role or channel',
        options: [
            {
                name: 'role',
                description: 'Delete a role',
                type: 8
            },
            {
                name: 'channel',
                description: 'Delete a channel',
                type: 7
            }
        ]
    }
};
