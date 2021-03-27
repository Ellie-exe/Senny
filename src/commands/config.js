const mariadb = require('mariadb');

module.exports = {
    /**
     * @param {import('../utils').Interaction} command
     * @param {import('../utils')} utils
     * @param {import('redis').RedisClient} cache
     */
    async execute(command, utils, cache) {
        try {
            const guildID = command.guildID;
            const option = command.data.options[0].name;

            const guild = command.client.guilds.cache.get(guildID);
            const author = await guild.members.fetch(command.authorID);

            if (await utils.check(author, guildID, {permissions: ['ADMINISTRATOR'], roles: ['admin']}) === false) {
                throw new Error('Missing Permissions');
            }

            const conn = await mariadb.createConnection({
                user: process.env.user,
                password: process.env.password,
                database: process.env.database
            });

            switch (option) {
                case 'admin': {
                    const roleID = command.data.options[0].options[0].value;
                    const role = guild.roles.cache.get(roleID);

                    const sql = 'INSERT INTO adminRoles VALUES (?, ?) ON DUPLICATE KEY UPDATE roleID=(?)';
                    await conn.query(sql, [guildID, roleID, roleID]);

                    await command.send(`**Success!** The admin role has been set to ${role}`, 64);
                    break;
                }

                case 'mod': {
                    const roleID = command.data.options[0].options[0].value;
                    const role = guild.roles.cache.get(roleID);

                    const sql = 'INSERT INTO modRoles VALUES (?, ?) ON DUPLICATE KEY UPDATE roleID=(?)';
                    await conn.query(sql, [guildID, roleID, roleID]);
                    
                    await command.send(`**Success!** The mod role has been set to ${role}`, 64);
                    break;
                }

                case 'mute': {
                    const roleID = command.data.options[0].options[0].value;
                    const role = guild.roles.cache.get(roleID);

                    const sql = 'INSERT INTO muteRoles VALUES (?, ?) ON DUPLICATE KEY UPDATE roleID=(?)'
                    await conn.query(sql, [guildID, roleID, roleID]);
                    
                    await command.send(`**Success!** The mute role has been set to ${role}`, 64);
                    break;
                }

                case 'filter': {
                    const toggle = command.data.options[0].options[0].name;

                    switch (toggle) {
                        case 'on': {
                            const regex = command.data.options[0].options[0].options[0].value;

                            const sql = 'INSERT INTO filters VALUES (?, ?) ON DUPLICATE KEY UPDATE regex=(?)';
                            await conn.query(sql, [guildID, regex, regex]);
                            await cache.hmsetAsync(guildID, 'regex', regex);

                            await command.send(`**Success!** The filter has been set to ${regex}`, 64);
                            break;
                        }

                        case 'off': {
                            const regex = await conn.query('SELECT regex FROM filters WHERE guildID=(?)', [guildID]);
                            if (regex.length === 0) throw new Error('You do not have a filter set');

                            await conn.query('DELETE FROM filters WHERE guildID=(?)', [guildID]);
                            await cache.hdelAsync(guildID, 'regex');

                            await command.send(`**Success!** The filter has been turned off`, 64);
                            break;
                        }
                    }

                    break;
                }

                case 'bump': {
                    const toggle = command.data.options[0].options[0].name;

                    switch (toggle) {
                        case 'on': {
                            const bump = await conn.query('SELECT guildID FROM bumps WHERE guildID=(?)', [guildID]);
                            if (bump.length !== 0) throw new Error('Bump reminders are already on');

                            await conn.query('INSERT INTO bumps VALUES (?)', [guildID]);
                            await cache.hmsetAsync(guildID, 'bump', true);

                            await command.send(`**Success!** Bump reminders have been turned on`, 64);
                            break;
                        }

                        case 'off': {
                            const bump = await conn.query('SELECT guildID FROM bumps WHERE guildID=(?)', [guildID]);
                            if (bump.length === 0) throw new Error('Bump reminders are already off');

                            await conn.query('DELETE FROM bumps WHERE guildID=(?)', [guildID]);
                            await cache.hdelAsync(guildID, 'bump');

                            await command.send(`**Success!** Bump reminders have been turned off`, 64);
                            break;
                        }
                    }

                    break;
                }

                case 'view': {
                    const adminRole = await conn.query('SELECT roleID FROM adminRoles WHERE guildID=(?)', [guildID]);
                    const modRole = await conn.query('SELECT roleID FROM modRoles WHERE guildID=(?)', [guildID]);
                    const muteRole = await conn.query('SELECT roleID FROM muteRoles WHERE guildID=(?)', [guildID]);
                    const bump = await conn.query('SELECT guildID FROM bumps WHERE guildID=(?)', [guildID]);
                    const regex = await conn.query('SELECT regex FROM filters WHERE guildID=(?)', [guildID]);

                    const embed = new utils.MessageEmbed()
                        .setAuthor(`${guild.name} - Config`)
                        .setDescription(
                            `Admin Role: ${adminRole.length === 0 ? '`Not Set`' : guild.roles.cache.get(adminRole[0].roleID)}\n`+
                            `Mod Role: ${modRole.length === 0 ? '`Not Set`' : guild.roles.cache.get(modRole[0].roleID)}\n`+
                            `Mute Role: ${muteRole.length === 0 ? '`Not Set`' : guild.roles.cache.get(muteRole[0].roleID)}\n`+
                            `Bump Reminder: ${bump.length === 0 ? '`Off`' : '`On`'}\n`+
                            `Filter: ${regex.length === 0 ? '`Off`' : `\`\`\`${regex[0].regex}\`\`\``}`
                        )
                        .setColor(process.env.color);

                    await command.embed([embed]);
                    break;
                }
            }

        await conn.end();

        } catch (err) {
            await command.error(err);
        }
    },

    data: {
        name: 'config',
        description: 'Configure server settings',
        options: [
            {
                name: 'admin',
                description: 'Set admin role',
                type: 1,
                options: [
                    {
                        name: 'role',
                        description: 'Role to set',
                        required: true,
                        type: 8
                    }
                ]
            },
            {
                name: 'mod',
                description: 'Set mod role',
                type: 1,
                options: [
                    {
                        name: 'role',
                        description: 'Role to set',
                        required: true,
                        type: 8
                    }
                ]
            },
            {
                name: 'mute',
                description: 'Set mute role',
                type: 1,
                options: [
                    {
                        name: 'role',
                        description: 'Role to set',
                        required: true,
                        type: 8
                    }
                ]
            },
            {
                name: 'filter',
                description: 'Set regex filter',
                type: 2,
                options: [
                    {
                        name: 'on',
                        description: 'Turn filter on',
                        type: 1,
                        options: [
                            {
                                name: 'regex',
                                description: 'Regex to set',
                                required: true,
                                type: 3
                            }
                        ]
                    },
                    {
                        name: 'off',
                        description: 'Turn filter off',
                        type: 1
                    }
                ]
            },
            {
                name: 'bump',
                description: 'Reminds to bump',
                type: 2,
                options: [
                    {
                        name: 'on',
                        description: 'Turn reminder on',
                        type: 1
                    },
                    {
                        name: 'off',
                        description: 'Turn reminder off',
                        type: 1
                    }
                ]
            },
            {
                name: 'view',
                description: 'View current configuration',
                type: 1
            }
        ]
    }
};
