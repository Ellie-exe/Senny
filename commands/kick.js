module.exports = {
    name: 'kick',
    async execute(command) {
        const constants = require('../utils/constants');
        const logger = require('@jakeyprime/logger');

        const guild_id = command.guild_id;
        const author_id = command.user.id;
        const user_id = command.data.options[0].value;
        const member = command.client.guilds.cache.get(guild_id).members.cache.get(user_id);
        const author = command.client.guilds.cache.get(guild_id).members.cache.get(author_id);

        if (author.hasPermission('KICK_MEMBERS') === false) {
            command.send(`${constants.emojis.redX} Error: \`DiscordAPIError: Missing Permissions\``, 3, 64);
            return;
        } 
                    
        let reason = undefined;
        let displayReason = 'None';
        let displayMember = `${member.toString()} ${member.user.tag}`;
        let silent = false;
        let error = false;
                    
        for (let i = 1; i < command.data.options.length; i++) {
            switch (command.data.options[i].name) {
                case 'reason':
                    reason = command.data.options[i].value;
                    displayReason = reason;
                    break;

                case 'silent':
                    silent = command.data.options[i].value;
                    break;
            }
        }

        await member.kick(reason)
            .catch((err) => {
                logger.error(err);
                command.send(`${constants.emojis.redX} Error: \`${err}\``, 3, 64);
                error = true;
            });

        if (error === false) {
            switch (silent) { 
                case false:
                    command.send(`${displayMember} has been kicked from the server for reason: \`${displayReason}\``);
                    break;
                            
                case true:
                    command.send(`${displayMember} has been kicked from the server for reason: \`${displayReason}\``, 3, 64);
                    break;
            }
        }
    }
};