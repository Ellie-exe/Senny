const utils = require('../utils');
/**
 * @param {import('discord.js').GuildMember} member
 * @param {import('discord.js').Snowflake} guildID
 * @param {{
 *      perms: import('discord.js').PermissionResolvable[], 
 *      roles: string[]
 * }} options
 */
module.exports = async (member, guildID, options = {perms: [], roles: []}) => {
    try {
        const database = new utils.database();

        let check = false;

        if (options.roles.includes('admin')) {
            await database
                .select('roleID')
                .from('adminRoles')
                .where('guildID', guildID)
                .query(async (err, res) => {
                    if (err) throw err;
                    if (res.length === 0) return;
                    if (member.roles.cache.has(res[0].roleID)) check = true;
                });
        }

        if (options.roles.includes('mod')) {
            await database
                .select('roleID')
                .from('modRoles')
                .where('guildID', guildID)
                .query(async (err, res) => {
                    if (err) throw err;
                    if (res.length === 0) return;
                    if (member.roles.cache.has(res[0].roleID)) check = true;
                });
        }

        for (const perm in options.perms) {
            if (member.hasPermission(options.perms[perm]) === true) check = true;
        }

        if (process.env.admins.includes(member.user.id)) check = true;

        return check;

    } catch (err) {
        utils.logger.error(err);
    }
};
