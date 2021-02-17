const mariadb = require('mariadb');
/**
 * @param {import('../../types').Interaction} command
 * @param {import('../../types').Utils} utils
 */
module.exports.execute = async (command, utils) => {
    try {
        const userID = command.data.options[0].value
        const guildID = command.guildID;
        const guild = command.client.guilds.cache.get(command.guildID);
        const member = await guild.members.fetch(userID);
        const author = await guild.members.fetch(command.authorID);
        
        const conn = await mariadb.createConnection({
            user: process.env.user, 
            password: process.env.password, 
            database: process.env.database
        });
        
        const muteRole = await conn.query('SELECT roleID FROM muteRoles WHERE guildID=(?)', [guildID]);
        const muteList = await conn.query('SELECT userID FROM muteList WHERE userID=(?)', [userID]);

        if (await utils.check(author, guildID, {roles: ['admin', 'mod']}) === false) throw new Error('Missing Permissions');
        if (muteRole.length === 0) throw new Error('The mute role has not been set');
        if (muteList.length === 0) throw new Error('That user is not muted');

        await member.roles.remove(muteRole[0].roleID);
        command.send(`${member.toString()} has been unmuted`);
        await conn.query('DELETE FROM muteList WHERE userID=(?)', [userID]);

        await conn.end();

    } catch (err) {
        command.send(`${utils.constants.emojis.redX} ${err.name}: \`${err.message}\``, {type: 3, flags: 64});
        utils.logger.error(err);
    }
};