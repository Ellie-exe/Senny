const Enmap = require('enmap');
/**
 * @param {import('../types').Interaction} command
 * @param {import('../types').Utils} utils
 */
module.exports.execute = async (command, utils) => {
    try {
        const author = await command.client.guilds.cache.get(command.guildID).members.fetch(command.authorID);
        const owner = await command.client.guilds.cache.get(command.guildID).owner;
        const option = command.data.options[0].name;
        
        if (author.id !== owner.id) throw new Error('Missing Permissions');

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
        }

    } catch (err) {
        command.send(`${utils.constants.emojis.redX} Error: \`${err}\``, {type: 3, flags: 64});
        utils.logger.error(err);
    }
};