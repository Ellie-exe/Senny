const mariadb = require('mariadb');

module.exports = {
    /**
     * Runs eval code
     * @param {import('discord.js').Message} message
     * @param {string[]} args
     * @param {import('../utils')} utils
     * @param {import('redis').RedisClient} cache
     */
    async execute(message, args, utils, cache) {
        try {
            if (!process.env.admins.includes(message.author.id)) throw new Error('Missing Permissions');

            const conn = await mariadb.createConnection({
                user: process.env.user,
                password: process.env.password,
                database: process.env.database
            });

            let code = args.join(' ');
            if (args.includes('await')) code = `(async () => {${args.join(' ')}})()`;

            let evaled = eval(code);
            if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);

            await message.channel.send(evaled, {code: 'xl', split: true});

        } catch (err) {
            message.channel.send(err, {code: 'xl', split: true}).catch(err => utils.logger.error(err));
            utils.logger.error(err);
        }
    }
};
