const { MessageEmbed } = require('discord.js');
const mariadb = require('mariadb');
/**
 * Config per guild settings
 * @param {import('../../types').Interaction} command
 * @param {import('../../types').Utils} utils
 * @param {import('redis').RedisClient} cache
 */
module.exports.execute = async (command, utils, cache) => {
    try {
        const guildID = command.guildID; // The current guild
        const authorID = command.authorID; // The command author
        const option = command.data.options[0].name; // The subcommand

        // Fetch the current guild and author
        const guild = await command.client.guilds.fetch(guildID);
        const author = await guild.members.fetch(authorID);

        // Check the author's permissions
        if (await utils.check(author, guildID, {permissions: ['ADMINISTRATOR'], roles: ['admin']}) === false) {
            throw new Error('Missing Permissions');
        }

        // Connect to the database
        const conn = await mariadb.createConnection({
            user: process.env.user,
            password: process.env.password,
            database: process.env.database
        });

        // Check which subcommand was used
        switch (option) {
            // Set the guild's admin role
            case 'admin': {
                // Get the role
                const roleID = command.data.options[0].options[0].value;
                const role = guild.roles.cache.get(roleID);

                // Add the role to the database and send an ephemeral confirmation message
                const sql = 'INSERT INTO adminRoles VALUES (?, ?) ON DUPLICATE KEY UPDATE roleID=(?)';
                await conn.query(sql, [guildID, roleID, roleID]);
                command.send(`Success! The admin role is now set to: \`${role.name}\``, {type: 3, flags: 64});
                break;
            }

            // Set the guild's mod role
            case 'mod': {
                // Get the role
                const roleID = command.data.options[0].options[0].value;
                const role = guild.roles.cache.get(roleID);

                // Add the role to the database and send an ephemeral confirmation message
                const sql = 'INSERT INTO modRoles VALUES (?, ?) ON DUPLICATE KEY UPDATE roleID=(?)';
                await conn.query(sql, [guildID, roleID, roleID]);
                command.send(`Success! The mod role is now set to: \`${role.name}\``, {type: 3, flags: 64});
                break;
            }

            // Set the guild's mute role
            case 'mute': {
                // Get the role
                const roleID = command.data.options[0].options[0].value;
                const role = guild.roles.cache.get(roleID);

                // Add the role to the database and send an ephemeral confirmation message
                const sql = 'INSERT INTO muteRoles VALUES (?, ?) ON DUPLICATE KEY UPDATE roleID=(?)'
                await conn.query(sql, [guildID, roleID, roleID]);
                command.send(`Success! The mute role is now set to: \`${role.name}\``, {type: 3, flags: 64});
                break;
            }

            // Set the guild's regex filter
            case 'filter': {
                // Whether to turn the filter on or off
                const options = command.data.options[0].options[0].value;

                // Check the setting
                switch (options) {
                    // Turns the filter on
                    case 'on': {
                        // Regex string
                        const regex = command.data.options[0].options[1].value;

                        // Add the regex to the database and the cache
                        const sql = 'INSERT INTO filters VALUES (?, ?) ON DUPLICATE KEY UPDATE regex=(?)';
                        await conn.query(sql, [guildID, regex, regex]);
                        await cache.hmsetAsync(guildID, 'regex', regex);
                        
                        // Send an ephemeral confirmation message
                        command.send(`Success! The filter has been set with the regex: \`${regex}\``, {type: 3, flags: 64});
                        break;
                    }

                    // Turn the filter off
                    case 'off': {
                        // Check to make sure a filter doesn't already exist
                        const regex = await conn.query('SELECT regex FROM filters WHERE guildID=(?)', [guildID]);
                        if (regex.length === 0) throw new Error('You do not have a filter set');

                        // If there is a filter, delete it from the database and the cache
                        await conn.query('DELETE FROM filters WHERE guildID=(?)', [guildID]);
                        await cache.hdelAsync(guildID, 'regex');
                        
                        // Send an ephemeral confirmation message
                        command.send(`Success! The filter has been turned off`, {type: 3, flags: 64});
                        break;
                    }
                }

                break;
            }

            // Automatically remind to bump after 2 hours
            case 'bump': {
                // Whether to turn the reminder on or off
                const options = command.data.options[0].options[0].value;

                // Check the setting
                switch (options) {
                    // Turn the reminder on
                    case 'on': {
                        // Check to make sure the reminder isn't already on
                        const bump = await conn.query('SELECT guildID FROM bumps WHERE guildID=(?)', [guildID]);
                        if (bump.length !== 0) throw new Error('Bump reminders are already on');

                        // If the reminder is not on, add it to the database and the cache
                        await conn.query('INSERT INTO bumps VALUES (?)', [guildID]);
                        await cache.hmsetAsync(guildID, 'bump', true);
                        
                        // Send an ephemeral confirmation message
                        command.send(`Success! You will now be reminded to bump`, {type: 3, flags: 64});
                        break;
                    }

                    // Turn the reminder off
                    case 'off': {
                        // Check to make sure the reminder isn't already off
                        const bump = await conn.query('SELECT guildID FROM bumps WHERE guildID=(?)', [guildID]);
                        if (bump.length === 0) throw new Error('Bump reminders are already off');

                        // If the reminder is not off, remove it from the database and the cache
                        await conn.query('DELETE FROM bumps WHERE guildID=(?)', [guildID]);
                        await cache.hdelAsync(guildID, 'bump');

                        // Send an ephemeral confirmation message
                        command.send(`Success! You will no longer be reminded to bump`, {type: 3, flags: 64});
                        break;
                    }
                }

                break;
            }

            // View a guild's config
            case 'view': {
                // Get everything from the database
                const adminRole = await conn.query('SELECT roleID FROM adminRoles WHERE guildID=(?)', [guildID]);
                const modRole = await conn.query('SELECT roleID FROM modRoles WHERE guildID=(?)', [guildID]);
                const muteRole = await conn.query('SELECT roleID FROM muteRoles WHERE guildID=(?)', [guildID]);
                const bump = await conn.query('SELECT guildID FROM bumps WHERE guildID=(?)', [guildID]);
                const regex = await conn.query('SELECT regex FROM filters WHERE guildID=(?)', [guildID]);

                // Create an embed
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

                // Send the embed
                command.embed([embed]);
                break;
            }
        }
    
    // End the database connection
    await conn.end();

    } catch (err) {
        // Log any errors
        command.error(err);
    }
};
