const mariadb = require('mariadb');

module.exports = async (member, guildID, options = {permissions: [], roles: []}) => {
    const conn = await mariadb.createConnection({
        user: process.env.user,
        password: process.env.password,
        database: process.env.database
    });

    let check = false;

    if (options.roles.includes('admin')) {
        const res = await conn.query('SELECT roleID FROM adminRoles WHERE guildID=(?)', [guildID]);

        if (res.length === 0) return;
        if (await member.roles.cache.has(res[0].roleID)) check = true;
    }

    if (options.roles.includes('mod')) {
        const res = await conn.query('SELECT roleID FROM modRoles WHERE guildID=(?)', [guildID]);

        if (res.length === 0) return;
        if (await member.roles.cache.has(res[0].roleID)) check = true;
    }

    for (const permission in options.permissions) {
        if (member.hasPermission(options.permissions[permission]) === true) check = true;
    }

    if (process.env.admins.includes(member.user.id)) check = true;

    await conn.end();
    return check;
}
