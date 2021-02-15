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
            case 'roles': {
                const role = command.data.options[0].options[0].name;

                switch (role) {
                    case 'mute': {
                        const guildID = command.guildID;
                        const roleID = command.data.options[0].options[0].options[0].value;
                        const guild = command.client.guilds.cache.get(guildID);
                        const role = guild.roles.cache.get(roleID);

                        const muteRole = new Enmap({name: 'muteRole'});

                        muteRole.set(guildID, roleID);
                        command.send(`Success! The mute role is now set to: \`${role.name}\``, {type: 3, flags: 64});

                        break;
                    }

                    case 'mod': {
                        const guildID = command.guildID;
                        const roleID = command.data.options[0].options[0].options[0].value;
                        const guild = command.client.guilds.cache.get(guildID);
                        const role = guild.roles.cache.get(roleID);

                        const modRole = new Enmap({name: 'modRole'});

                        modRole.set(guildID, roleID);
                        command.send(`Success! The mod role is now set to: \`${role.name}\``, {type: 3, flags: 64});

                        break;
                    }

                    case 'admin': {
                        const guildID = command.guildID;
                        const roleID = command.data.options[0].options[0].options[0].value;
                        const guild = command.client.guilds.cache.get(guildID);
                        const role = guild.roles.cache.get(roleID);

                        const adminRole = new Enmap({name: 'adminRole'});

                        adminRole.set(guildID, roleID);
                        command.send(`Success! The admin role is now set to: \`${role.name}\``, {type: 3, flags: 64});

                        break;
                    }
                }

                break;
            }

            case 'filter': {
                const guildID = command.guildID;
                const setting = command.data.options[0].options[0].name;

                switch (setting) {
                    case 'set': {
                        const regex = command.data.options[0].options[0].options[0].value;

                        const filter = new Enmap({name: 'filter'});

                        filter.set(guildID, regex);
                        command.send(`Success! The filter has been set with the regex: \`${regex}\``, {type: 3, flags: 64});
                        
                        break;
                    }

                    case 'remove': {
                        const filter = new Enmap({name: 'filter'});
                        
                        if (!filter.get(guildID)) throw new Error('You do not have a filter set!');

                        filter.delete(guildID);
                        command.send(`Success! The filter has been turned off`, {type: 3, flags: 64});
                        
                        break;
                    }
                }

                break;
            }

            case 'show': {
                const guildID = command.guildID;
                const guild = command.client.guilds.cache.get(guildID);

                const adminRoles = new Enmap({name: 'adminRole'});
                const modRoles = new Enmap({name: 'modRole'});
                const muteRoles = new Enmap({name: 'muteRole'});
                const filters = new Enmap({name: 'filter'});

                const adminRoleID = adminRoles.get(guildID);
                const modRoleID = modRoles.get(guildID);
                const muteRoleID = muteRoles.get(guildID);
                const filter = filters.get(guildID);

                let adminRole;
                let modRole;
                let muteRole;

                if (adminRoleID !== undefined) {
                    adminRole = guild.roles.cache.get(adminRoleID);
                }
                
                if (modRoleID !== undefined) {
                    modRole = guild.roles.cache.get(modRoleID);
                }
                
                if (muteRoleID !== undefined) {
                    muteRole = guild.roles.cache.get(muteRoleID);
                }

                const embed = new MessageEmbed()
                    .setAuthor(`${guild.name} - Config`)
                    .setDescription(
                        `Admin Role: ${adminRole || '`Not Set`'}\n`+
                        `Mod Role: ${modRole || '`Not Set`'}\n`+
                        `Mute Role: ${muteRole || '`Not Set`'}\n`+
                        `Filter: ${filter || '`Not Set`'}`
                    )
                    .setColor(process.env.color);

                command.embed([embed]);
                break;
            }
        }

    } catch (err) {
        command.send(`${utils.constants.emojis.redX} Error: \`${err}\``, {type: 3, flags: 64});
        utils.logger.error(err);
    }
};