const { MessageEmbed } = require('discord.js');
const Enmap = require('enmap');
/**
 * @param {import('../../types').Interaction} command
 * @param {import('../../types').Utils} utils
 */
module.exports.execute = async (command, utils) => {
    try {
        const author = await command.client.guilds.cache.get(command.guildID).members.fetch(command.authorID);
        const guildID = command.guildID;
        const option = command.data.options[0].name;
        
        if (await utils.check(author, guildID, {permissions: ['ADMINISTRATOR'], roles: ['admin']}) === false) {
            throw new Error('Missing Permissions');
        }

        switch (option) {
            case 'mute': {
                const guildID = command.guildID;
                const roleID = command.data.options[0].options[0].value;
                const guild = command.client.guilds.cache.get(guildID);
                const role = guild.roles.cache.get(roleID);

                const muteRole = new Enmap({name: 'muteRole'});

                muteRole.set(guildID, roleID);
                command.send(`Success! The mute role is now set to: \`${role.name}\``, {type: 3, flags: 64});

                break;
            }

            case 'mod': {
                const guildID = command.guildID;
                const roleID = command.data.options[0].options[0].value;
                const guild = command.client.guilds.cache.get(guildID);
                const role = guild.roles.cache.get(roleID);

                const modRole = new Enmap({name: 'modRole'});

                modRole.set(guildID, roleID);
                command.send(`Success! The mod role is now set to: \`${role.name}\``, {type: 3, flags: 64});

                break;
            }

            case 'admin': {
                const guildID = command.guildID;
                const roleID = command.data.options[0].options[0].value;
                const guild = command.client.guilds.cache.get(guildID);
                const role = guild.roles.cache.get(roleID);

                const adminRole = new Enmap({name: 'adminRole'});

                adminRole.set(guildID, roleID);
                command.send(`Success! The admin role is now set to: \`${role.name}\``, {type: 3, flags: 64});

                break;
            }

            case 'filter': {
                const guildID = command.guildID;
                const options = command.data.options[0].options[0].value;
                const filter = new Enmap({name: 'filter'});

                switch (options) {
                    case 'on': {
                        const regex = command.data.options[0].options[1].value;

                        filter.set(guildID, regex);
                        command.send(`Success! The filter has been set with the regex: \`${regex}\``, {type: 3, flags: 64});
                        break;
                    }

                    case 'off': {
                        if (!filter.get(guildID)) throw new Error('You do not have a filter set!');

                        filter.delete(guildID);
                        command.send(`Success! The filter has been turned off`, {type: 3, flags: 64});
                        break;
                    }
                }

                break;
            }

            case 'bump': {
                const guildID = command.guildID;
                const options = command.data.options[0].options[0].value;
                const bump = new Enmap({name: 'bump'});

                switch (options) {
                    case 'on': {
                        bump.set(guildID, 'On');
                        command.send(`Success! You will now be reminded to bump automatically`, {type: 3, flags: 64});
                        break;
                    }

                    case 'off': {
                        bump.delete(guildID);
                        command.send(`Success! You will no longer be reminded`, {type: 3, flags: 64});
                        break;
                    }
                }

                break;
            }

            case 'view': {
                const guildID = command.guildID;
                const guild = command.client.guilds.cache.get(guildID);

                const adminRoles = new Enmap({name: 'adminRole'});
                const modRoles = new Enmap({name: 'modRole'});
                const muteRoles = new Enmap({name: 'muteRole'});
                const filters = new Enmap({name: 'filter'});
                const bump = new Enmap({name: 'bump'});

                const adminRoleID = adminRoles.get(guildID);
                const modRoleID = modRoles.get(guildID);
                const muteRoleID = muteRoles.get(guildID);
                const filter = filters.get(guildID);
                const bumpValue = bump.get(guildID);

                let adminRole;
                let modRole;
                let muteRole;
                let bumpBool;
                let filterRegex;

                if (adminRoleID !== undefined) {
                    adminRole = guild.roles.cache.get(adminRoleID);
                }
                
                if (modRoleID !== undefined) {
                    modRole = guild.roles.cache.get(modRoleID);
                }
                
                if (muteRoleID !== undefined) {
                    muteRole = guild.roles.cache.get(muteRoleID);
                }

                if (bumpValue !== undefined) {
                    bumpBool = `\`${bumpValue}\``;
                }

                if (filter !== undefined) {
                    filterRegex = `\`\`\`${filter}\`\`\``;
                }

                const embed = new MessageEmbed()
                    .setAuthor(`${guild.name} - Config`)
                    .setDescription(
                        `Admin Role: ${adminRole || '`Not Set`'}\n`+
                        `Mod Role: ${modRole || '`Not Set`'}\n`+
                        `Mute Role: ${muteRole || '`Not Set`'}\n`+
                        `Bump Reminder: ${bumpBool || '`Off`'}\n`+
                        `Filter: ${filterRegex || '`Off`'}`
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