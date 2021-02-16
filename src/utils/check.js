const Enmap = require('enmap');

module.exports = async (member, guild, options = {permissions: [], roles: []}) => {
    let check = false;

    if (options.roles.includes('admin')) {
        const adminRole = new Enmap({name: 'adminRole'});
        const admin = await member.roles.cache.has(adminRole.get(guild));

        if (admin === true) check = true;
    }
    
    if (options.roles.includes('mod')) {
        const modRole = new Enmap({name: 'modRole'});
        const mod = await member.roles.cache.has(modRole.get(guild));

        if (mod === true) check = true;
    }

    for (const permission in options.permissions) {
        if (member.hasPermission(options.permissions[permission]) === true) check = true;
    }

    if (process.env.admins.includes(member.user.id)) check = true;

    return check;
}