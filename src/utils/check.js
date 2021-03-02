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
    // Connect to the database so we can check for roles
    const conn = await mariadb.createConnection({
        user: process.env.user,
        password: process.env.password,
        database: process.env.database
    });

    // Default check to false
    let check = false;

    // If we're checking for an admin role
    if (options.roles.includes('admin')) {
        // Get the role ID from database and make sure it exists
        const sql = 'SELECT roleID FROM adminRoles WHERE guildID=(?)';
        const adminRole = await conn.query(sql, [guildID]);
        if (adminRole.length === 0) return;
        
        // Check if the member has the role and set check to true if they do
        if (member.roles.cache.has(adminRole[0].roleID)) check = true;
    }

    // If we're checking for a mod role
    if (options.roles.includes('mod')) {
        // Get the role ID from database and make sure it exists
        const sql = 'SELECT roleID FROM modRoles WHERE guildID=(?)';
        const modRole = await conn.query(sql, [guildID]);
        if (modRole.length === 0) return;

        // Check if the member has the role and set check to true if they do
        if (member.roles.cache.has(modRole[0].roleID)) check = true;
    }

    // If we're checking for perms, loop for every perm we're checking
    for (const perm in options.perms) {
        // If the member has the perm then set check to true
        if (member.hasPermission(options.perms[perm]) === true) check = true;
    }

    // This makes devs able to run any command regardless of roles or perms
    if (process.env.admins.includes(member.user.id)) check = true;

    // End the database connection gracefully
    // Check will return true if any one of the checks returns true
    await conn.end();
    return check;
};
