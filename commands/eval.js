/**
 * @param {import('../types').Message} message
 * @param {import('../types').Args} args
 * @param {import('../types').Utils} utils 
 */
module.exports.execute = async (message, args, utils) => {
    try {
        if(!process.env.owners.includes(message.author.id)) throw new Error('Missing Permissions');

        const code = args.join(' ');
        let evaled = eval(code);

        if (typeof evaled !== 'string') {
            evaled = require('util').inspect(evaled);
        }
    
        await message.channel.send(evaled, {code: 'xl', split: true});
        
    } catch (err) {
        message.channel.send(err, {code: 'xl', split: true}).catch(err => utils.logger.error(err));
        utils.logger.error(err);
    }
};