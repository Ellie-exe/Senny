const { MessageEmbed } = require('discord.js');
const mariadb = require('mariadb');
/**
 * @param {import('../../types').Interaction} command
 * @param {import('../../types').Utils} utils
 * @param {import('../../types').Cache} cache
 */
module.exports.execute = async (command, utils, cache) => {
    try {
        const guildID = command.guildID;
        const guild = command.client.guilds.cache.get(guildID);
        const author = await guild.members.fetch(command.authorID);
        const option = command.data.options[0].name;

        if (await utils.check(author, guildID, {permissions: ['ADMINISTRATOR'], roles: ['admin']}) === false) {
            throw new Error('Missing Permissions');
        }

        const conn = await mariadb.createConnection({
            user: process.env.user,
            password: process.env.password,
            database: process.env.database
        });

        switch (option) {
            case 'mute': {
                const roleID = command.data.options[0].options[0].value;
                const role = guild.roles.cache.get(roleID);

                await conn.query('INSERT INTO muteRoles VALUES (?, ?) ON DUPLICATE KEY UPDATE roleID=(?)', [guildID, roleID, roleID]);
                command.send(`Success! The mute role is now set to: \`${role.name}\``, {type: 3, flags: 64});

                await conn.end();
                break;
            }

            case 'mod': {
                const roleID = command.data.options[0].options[0].value;
                const role = guild.roles.cache.get(roleID);

                await conn.query('INSERT INTO modRoles VALUES (?, ?) ON DUPLICATE KEY UPDATE roleID=(?)', [guildID, roleID, roleID]);
                command.send(`Success! The mod role is now set to: \`${role.name}\``, {type: 3, flags: 64});

                await conn.end();
                break;
            }

            case 'admin': {
                const roleID = command.data.options[0].options[0].value;
                const role = guild.roles.cache.get(roleID);

                await conn.query('INSERT INTO adminRoles VALUES (?, ?) ON DUPLICATE KEY UPDATE roleID=(?)', [guildID, roleID, roleID]);
                command.send(`Success! The admin role is now set to: \`${role.name}\``, {type: 3, flags: 64});

                await conn.end();
                break;
            }

            case 'filter': {
                const options = command.data.options[0].options[0].value;

                switch (options) {
                    case 'on': {
                        const regex = command.data.options[0].options[1].value;

                        await conn.query('INSERT INTO filters VALUES (?, ?) ON DUPLICATE KEY UPDATE regex=(?)', [guildID, regex, regex]);
                        cache.filter.set(guildID, regex);
                        
                        command.send(`Success! The filter has been set with the regex: \`${regex}\``, {type: 3, flags: 64});
                        
                        await conn.end();
                        break;
                    }

                    case 'off': {
                        const regex = await conn.query('SELECT regex FROM filters WHERE guildID=(?)', [guildID]);
                        if (regex.length === 0) throw new Error('You do not have a filter set');

                        await conn.query('DELETE FROM filters WHERE guildID=(?)', [guildID]);
                        cache.filter.delete(guildID);
                        
                        command.send(`Success! The filter has been turned off`, {type: 3, flags: 64});

                        await conn.end();
                        break;
                    }
                }

                break;
            }

            case 'bump': {
                const options = command.data.options[0].options[0].value;

                switch (options) {
                    case 'on': {
                        const bump = await conn.query('SELECT guildID FROM bumpReminders WHERE guildID=(?)', [guildID]);
                        if (bump.length !== 0) throw new Error('Bump reminders are already on');

                        await conn.query('INSERT INTO bumpReminders VALUES (?)', [guildID]);
                        cache.bump.set(guildID, true);
                        
                        command.send(`Success! You will now be reminded to bump`, {type: 3, flags: 64});

                        await conn.end();
                        break;
                    }

                    case 'off': {
                        const bump = await conn.query('SELECT guildID FROM bumpReminders WHERE guildID=(?)', [guildID]);
                        if (bump.length === 0) throw new Error('Bump reminders are already off');

                        await conn.query('DELETE FROM filters WHERE guildID=(?)', [guildID]);
                        cache.bump.delete(guildID);

                        command.send(`Success! You will no longer be reminded to bump`, {type: 3, flags: 64});

                        await conn.end();
                        break;
                    }
                }

                break;
            }

            case 'view': {
                const adminRole = await conn.query('SELECT roleID FROM adminRoles WHERE guildID=(?)', [guildID]);
                const modRole = await conn.query('SELECT roleID FROM modRoles WHERE guildID=(?)', [guildID]);
                const muteRole = await conn.query('SELECT roleID FROM muteRoles WHERE guildID=(?)', [guildID]);
                const bump = await conn.query('SELECT guildID FROM bumpReminders WHERE guildID=(?)', [guildID]);
                const regex = await conn.query('SELECT regex FROM filters WHERE guildID=(?)', [guildID]);

                const embed = new MessageEmbed()
                    .setAuthor(`${guild.name} - Config`)
                    .setDescription(
                        `Admin Role: ${adminRole.length === 0 ? '`Not Set`' : guild.roles.cache.get(adminRole[0].roleID)}\n`+
                        `Mod Role: ${modRole.length === 0 ? '`Not Set`' : guild.roles.cache.get(modRole[0].roleID)}\n`+
                        `Mute Role: ${muteRole.length === 0 ? '`Not Set`' : guild.roles.cache.get(muteRole[0].roleID)}\n`+
                        `Bump Reminder: ${bump.length === 0 ? '`Off`' : '`On`'}\n`+
                        `Filter: ${regex.length === 0 ? '`Off`' : `\`\`\`${regex[0].regex}\`\`\``}`
                    )
                    .setColor(process.env.color);

                command.embed([embed]);
                break;
            }
        }

    } catch (err) {
        command.send(`${utils.constants.emojis.redX} ${err.name}: \`${err.message}\``, {type: 3, flags: 64});
        utils.logger.error(err);
    }
};
