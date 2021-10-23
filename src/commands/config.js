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

            const database = new utils.database();

            switch (option) {
                case 'admin': {
                    const roleID = command.data.options[0].options[0].value;
                    const role = guild.roles.cache.get(roleID);

                    await database
                        .insert('adminRoles')
                        .values(guildID, roleID)
                        .onDupe({roleID: roleID})
                        .query(async (err) => {
                            if (err) throw err;
                            await command.send(`**Success!** The admin role has been set to ${role}`, 64);
                        });

                    break;
                }

                case 'mod': {
                    const roleID = command.data.options[0].options[0].value;
                    const role = guild.roles.cache.get(roleID);

                    await database
                        .insert('modRoles')
                        .values(guildID, roleID)
                        .onDupe({roleID: roleID})
                        .query(async (err) => {
                            if (err) throw err;
                            await command.send(`**Success!** The mod role has been set to ${role}`, 64);
                        });

                    break;
                }

                case 'mute': {
                    const roleID = command.data.options[0].options[0].value;
                    const role = guild.roles.cache.get(roleID);

                    await database
                        .insert('muteRoles')
                        .values(guildID, roleID)
                        .onDupe({roleID: roleID})
                        .query(async (err) => {
                            if (err) throw err;
                            await command.send(`**Success!** The mute role has been set to ${role}`, 64);
                        });

                    break;
                }

                case 'filter': {
                    const toggle = command.data.options[0].options[0].name;

                    switch (toggle) {
                        case 'on': {
                            const regex = command.data.options[0].options[0].options[0].value;

                            await cache.hmsetAsync(guildID, 'regex', regex);
                            await database
                                .insert('filters')
                                .values(guildID, regex)
                                .onDupe({regex: regex})
                                .query(async (err) => {
                                    if (err) throw err;
                                    await command.send(`**Success!** The filter has been set to ${regex}`, 64);
                                });

                            break;
                        }

                        case 'off': {
                            await database
                                .select('regex')
                                .from('filters')
                                .where('guildID', guildID)
                                .query(async (err, res) => {
                                    if (err) throw err;
                                    if (res.length === 0) throw Error('You do not have a filter set');

                                    await cache.hdelAsync(guildID, 'regex');
                                    await database
                                        .delete('filters')
                                        .where('guildID', guildID)
                                        .query(async (err) => {
                                            if (err) throw err;
                                            await command.send(`**Success!** The filter has been turned off`, 64);
                                        });
                                });

                            break;
                        }
                    }

                    break;
                }

                case 'bump': {
                    const toggle = command.data.options[0].options[0].name;

                    switch (toggle) {
                        case 'on': {
                            await new utils.database()
                                .select('guildID')
                                .from('bumps')
                                .where('guildID', guildID)
                                .query(async (err, res) => {
                                    if (err) throw err;
                                    if (res.length !== 0) throw new Error('Bump reminders are already on');

                                    await cache.hmsetAsync(guildID, 'bump', true);
                                    await new utils.database()
                                        .insert('bumps')
                                        .values(guildID)
                                        .query(async (err) => {
                                            if (err) throw err;
                                            await command.send(`**Success!** Bump reminders have been turned on`, 64);
                                        });
                                });

                            break;
                        }

                        case 'off': {
                            await database
                                .select('guildID')
                                .from('bumps')
                                .where('guildID', guildID)
                                .query(async (err, res) => {
                                    if (err) throw err;
                                    if (res.length === 0) throw Error('Bump reminders are already off');

                                    await cache.hdelAsync(guildID, 'bump');
                                    await database
                                        .delete('bumps')
                                        .where('guildID', guildID)
                                        .query(async (err) => {
                                            if (err) throw err;
                                            await command.send(`**Success!** Bump reminders have been turned off`, 64);
                                        });
                                });

                            break;
                        }
                    }

                    break;
                }

                case 'view': {
                    let adminRole = 'Not Set';
                    let modRole = 'Not Set';
                    let muteRole = 'Not Set';
                    let bump = 'Off';
                    let regex = 'Off';

                    await database
                        .select('roleID')
                        .from('adminRoles')
                        .where('guildID', guildID)
                        .query(async (err, res) => {
                            if (err) throw err;
                            if (res.length > 0) adminRole = guild.roles.cache.get(res[0].roleID);
                        });

                    await database
                        .select('roleID')
                        .from('modRoles')
                        .where('guildID', guildID)
                        .query(async (err, res) => {
                            if (err) throw err;
                            if (res.length > 0) modRole = guild.roles.cache.get(res[0].roleID);
                        });

                    await database
                        .select('roleID')
                        .from('muteRoles')
                        .where('guildID', guildID)
                        .query(async (err, res) => {
                            if (err) throw err;
                            if (res.length > 0) muteRole = guild.roles.cache.get(res[0].roleID);
                        });

                    await database
                        .select('guildID')
                        .from('bumps')
                        .where('guildID', guildID)
                        .query(async (err, res) => {
                            if (err) throw err;
                            if (res.length > 0) bump = 'On';
                        });

                    await database
                        .select('regex')
                        .from('filters')
                        .where('guildID', guildID)
                        .query(async (err, res) => {
                            if (err) throw err;
                            if (res.length > 0) regex = `\`\`\`${res[0].regex}\`\`\``;
                        });

                    const embed = new utils.MessageEmbed()
                        .setAuthor(`${guild.name} - Config`)
                        .setDescription(
                            `Admin Role: ${adminRole}\n`+
                            `Mod Role: ${modRole}\n`+
                            `Mute Role: ${muteRole}\n`+
                            `Bump Reminder: ${bump}\n`+
                            `Filter: ${regex}`
                        )
                        .setColor(process.env.color);

                    await command.embed([embed]);
                    break;
                }
            }

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
