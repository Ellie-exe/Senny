const mariadb = require('mariadb');
/**
 * Runs eval code
 * @param {import('discord.js').Message} message
 * @param {string[]} args
 * @param {import('../utils')} utils
 * @param {import('redis').RedisClient} cache
 */
module.exports.execute = async (message, args, utils, cache) => {
    try {
        // Check if the author is a dev
        if (!process.env.admins.includes(message.author.id)) throw new Error('Missing Permissions');

        // Connect to the database
        // This is so it can be accessed by eval commands
        // This is also why cache is included in the args
        const conn = await mariadb.createConnection({
            user: process.env.user,
            password: process.env.password,
            database: process.env.database
        });

        // Join all the args into one line of code, if it's async code then format accordingly
        let code = args.join(' ');
        if (args.includes('await')) code = `(async () => {${args.join(' ')}})()`;

        // Eval the code, if the returned data is not a string, then convert it to a string
        let evaled = eval(code);
        if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);

        // Send the output
        await message.channel.send(evaled, {code: 'xl', split: true});

    } catch (err) {
        // Send and log any errors
        message.channel.send(err, {code: 'xl', split: true}).catch(err => utils.logger.error(err));
        utils.logger.error(err);
    }
};
