const mariadb = require('mariadb');

module.exports = {
    /**
     * Mutes a member
     * @param {import('../utils').Interaction} command
     * @param {import('../utils')} utils
     */
    async execute(command, utils) {
        try {
            const guildID = command.guildID; // The current guild
            const memberID = command.data.options[0].value; // The user to mute
            const authorID = command.authorID; // The command author

            // Fetch the current guild, user, and author
            const guild = await command.client.guilds.fetch(guildID);
            const member = await guild.members.fetch(memberID);
            const author = await guild.members.fetch(authorID);

            // Set the reason to undefined if no reason is provided
            const reason = command.data.options.length === 2 ? command.data.options[1].value : undefined;

            // Connect to the database
            const conn = await mariadb.createConnection({
                user: process.env.user,
                password: process.env.password,
                database: process.env.database
            });

            // Get the mute role and list of muted members
            const muteRole = await conn.query('SELECT roleID FROM muteRoles WHERE guildID=(?)', [guildID]);
            const muteList = await conn.query('SELECT userID FROM muteList WHERE userID=(?)', [userID]);

            // Check the author's perms and if the mute role is set as well as if the user is already muted
            if (await utils.check(author, guildID, {roles: ['admin', 'mod']}) === false) throw new Error('Missing Permissions');
            if (muteRole.length === 0) throw new Error('The mute role has not been set');
            if (muteList.length !== 0) throw new Error('That user is already muted');

            // Add the mute role and add the user to the list of muted users
            await member.roles.add(muteRole[0].roleID, reason);
            await conn.query('INSERT INTO muteList VALUES (?)', [userID]);
            await conn.end();
            
            // Send a confirmation message
            command.send(`${member.toString()} has been muted for reason: \`${reason || 'None'}\``);

        } catch (err) {
            // Log any errors
            command.error(err);
        }
    },

    // The data to register the command
    json: {
        name: 'mute',
        description: 'Mute a user in the server',
        options: [
            {
                name: 'user',
                description: 'The user to mute',
                type: 6,
                required: true
            },
            {
                name: 'reason',
                description: 'The reason for the mute',
                type: 3
            }
        ]
    }
};
