const mariadb = require('mariadb');
/**
 * Unmutes a member
 * @param {import('../utils').Interaction} command
 * @param {import('../utils')} utils
 */
module.exports.execute = async (command, utils) => {
    try {
        const userID = command.data.options[0].value; // The ID of the member to unmute
        const guildID = command.guildID; // The ID of the current guild
        const guild = command.client.guilds.cache.get(command.guildID); // The current guild
        const member = await guild.members.fetch(userID); // The member to unmute
        const author = await guild.members.fetch(command.authorID); // The command author

        // Connect to the database
        const conn = await mariadb.createConnection({
            user: process.env.user,
            password: process.env.password,
            database: process.env.database
        });

        // Get the server's mute role ID as well as the list of currently muted members
        const muteRole = await conn.query('SELECT roleID FROM muteRoles WHERE guildID=(?)', [guildID]);
        const muteList = await conn.query('SELECT userID FROM muteList WHERE userID=(?)', [userID]);

        // Check if the author is not staff or if the member is not muted or the mute role is not set up
        if (await utils.check(author, guildID, {roles: ['admin', 'mod']}) === false) throw new Error('Missing Permissions');
        if (muteRole.length === 0) throw new Error('The mute role has not been set');
        if (muteList.length === 0) throw new Error('That user is not muted');

        // Remove the mute role and remove the member from the mute list
        await member.roles.remove(muteRole[0].roleID);
        command.send(`${member.toString()} has been unmuted`);
        await conn.query('DELETE FROM muteList WHERE userID=(?)', [userID]);

        // End the database connection
        await conn.end();

    } catch (err) {
        // Log any errors
        command.error(err);
    }
};
