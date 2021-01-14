const logger = require('@jakeyprime/logger');

module.exports = {
    name: 'eval',
    async execute(message, args) {
        if(process.env.owners.includes(message.author.id) === false) {
            message.channel.send('<:red_x:717257458657263679> Error: `DiscordAPIError: Missing Permissions`');
            return;
        }
        
        const code = args.join(' ');
        let evaled = eval(code);

        if (typeof evaled !== 'string')
            evaled = require('util').inspect(evaled);

        message.channel.send(evaled, { code: 'xl' })
            .catch(err => {
                message.channel.send(err, { code: 'xl' });
                logger.error(err);
            });
    }
};