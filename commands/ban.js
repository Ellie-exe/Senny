const logger = require('@jakeyprime/logger');

module.exports = {
    name: 'ban',
    async execute(i) {
        const member = i.client.guilds.cache.get(i.guild_id).members.cache.get(i.data.options[0].value);
        const author = i.client.guilds.cache.get(i.guild_id).members.cache.get(i.user.id);
                
        let days = 0;
        let reason = undefined;
        let displayReason = 'None';
        let displayMember = `${member.toString()} ${member.user.tag}`;
        let silent = false;
        let error = false;

        if (author.hasPermission('BAN_MEMBERS') === false) {
            i.send(`<:red_x:717257458657263679> Error: \`DiscordAPIError: Missing Permissions\``, 3, 64);
            return;
        }
                
        for (let j = 1; j < i.data.options.length; j++) {
            switch (i.data.options[j].name) {
                case 'delete':
                    days = i.data.options[j].value;
                    break;

                case 'reason':
                    reason = i.data.options[j].value;
                    displayReason = reason;
                    break;

                case 'silent':
                    silent = i.data.options[j].value;
                    break;
            }
        }

        await member.ban({ days: days, reason: reason })
            .catch((err) => {
                error = true;
                logger.error(err);
                i.send(`<:red_x:717257458657263679> Error: \`${err}\``, 3, 64);
            });

        if (error === false) {
            switch (silent) {
                case false:
                    i.send(`${displayMember} has been banned from the server for reason: \`${displayReason}\``);
                    break;
                            
                case true:
                    i.send(`${displayMember} has been banned from the server for reason: \`${displayReason}\``, 3, 64);
                    break;
            }
        }
    }
};