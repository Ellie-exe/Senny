module.exports = {
    name: 'eval',
    async execute(message, args) {
        const constants = require('../utils/constants');
        const logger = require('@jakeyprime/logger');

        if(process.env.owners.includes(message.author.id) === false) {
            message.channel.send(`${constants.emojis.redX} Error: \`DiscordAPIError: Missing Permissions\``);
            return;
        }
        
        try {
            const code = args.join(' ');
            let evaled = eval(code);

            if (typeof evaled !== 'string')
                evaled = require('util').inspect(evaled);

            message.channel.send(evaled, {code: 'xl'})
                .catch(err => {
                    message.channel.send(err, {code: 'xl'});
                    logger.error(err);
                });
        
        } catch (err) {
            message.channel.send(err, {code: 'xl'});
            logger.error(err);
        }
    }
};