const mariadb = require('mariadb');
const discord = require('discord.js');

module.exports = {
    /**
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

            let code = message.content.match(/(?<=```js\n).*(?=\n```)/s)[0];
            if (code.includes('await')) code = `(async () => {\n    ${code.replace(/\n/g, '\n    ')}\n\n})();`;

            let output = await eval(code);

            if (output instanceof Promise) await output;
            if (typeof output === 'function') result = output.toString();
            if (typeof output !== 'string') result = require('util').inspect(output, {depth: 0});

            await message.channel.send(result, {code: 'xl', split: true});

        } catch (err) {
            await message.channel.send(err, {code: 'xl', split: true}).catch(err => utils.logger.error(err));
            utils.logger.error(err);
        }
    }
};
