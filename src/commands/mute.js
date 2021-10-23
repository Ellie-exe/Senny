const mariadb = require('mariadb');

module.exports = {
    /**
     * @param {import('../utils').Interaction} command
     * @param {import('../utils')} utils
     */
    async execute(command, utils) {
        try {
            const guildID = command.guildID;
            const guild = await command.client.guilds.fetch(guildID);
            const member = await guild.members.fetch(command.data.options[0].value);
            const author = await guild.members.fetch(command.authorID);

            const reason = command.data.options.length === 2 ? command.data.options[1].value : undefined;

            const conn = await mariadb.createConnection({
                user: process.env.user,
                password: process.env.password,
                database: process.env.database
            });

            const muteRole = await conn.query('SELECT roleID FROM muteRoles WHERE guildID=(?)', [guildID]);
            const muteList = await conn.query('SELECT userID FROM muteList WHERE userID=(?)', [userID]);

            if (await utils.check(author, guildID, {roles: ['admin', 'mod']}) === false) {
                throw new Error('Missing Permissions');
            }

            if (muteRole.length === 0) throw new Error('The mute role has not been set');
            if (muteList.length !== 0) throw new Error('That member is already muted');

            await member.roles.add(muteRole[0].roleID, reason);
            await conn.query('INSERT INTO muteList VALUES (?)', [userID]);
            await conn.end();
            
            await command.send(`${member.toString()} has been muted for reason: \`${reason || 'None'}\``, 64);

        } catch (err) {
            await command.error(err);
        }
    },

    data: {
        name: 'mute',
        description: 'Mute a server member',
        options: [
            {
                name: 'member',
                description: 'Member to mute',
                required: true,
                type: 6
            },
            {
                name: 'reason',
                description: 'Reason for muting',
                type: 3
            }
        ]
    }
};
