const mariadb = require('mariadb');
/**
 * Checks if a member has certain permissions or roles
 * @param {import('discord.js').GuildMember} member
 * @param {import('discord.js').Snowflake} guildID
 * @param {{
 *      perms: import('discord.js').PermissionResolvable[], 
 *      roles: string[]
 * }} options
 */
module.exports = async (member, guildID, options = {perms: [], roles: []}) => {
    const conn = await mariadb.createConnection({
        user: process.env.user,
        password: process.env.password,
        database: process.env.database
    });

    let check = false;

    if (options.roles.includes('admin')) {
        const sql = 'SELECT roleID FROM adminRoles WHERE guildID=(?)';
        const adminRole = await conn.query(sql, [guildID]);
        if (adminRole.length === 0) return;
        
        if (member.roles.cache.has(adminRole[0].roleID)) check = true;
    }

    if (options.roles.includes('mod')) {
        const sql = 'SELECT roleID FROM modRoles WHERE guildID=(?)';
        const modRole = await conn.query(sql, [guildID]);
        if (modRole.length === 0) return;

        if (member.roles.cache.has(modRole[0].roleID)) check = true;
    }

    for (const perm in options.perms) {
        if (member.hasPermission(options.perms[perm]) === true) check = true;
    }

    if (process.env.admins.includes(member.user.id)) check = true;

    await conn.end();
    return check;
};
