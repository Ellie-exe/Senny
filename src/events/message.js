const parseRegex = require('regex-parser');
/**
 * Fires every time a message is sent
 * @param {import('discord.js').Message} message
 * @param {import('../utils')} utils
 * @param {import('redis').RedisClient} cache
 */
module.exports = async (message, dev, utils, cache) => {
    try {
        const args = message.content.slice(process.env.prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();

        if (message.author.bot) return;

        const regex = await cache.hgetAsync(message.guild.id, 'regex');
        const bump = await cache.hgetAsync(message.guild.id, 'bump');

        if (regex !== null) {
            const author = await message.guild.members.fetch(message.author.id);
            const guildID = message.guild.id;

            const words = message.content.match(parseRegex(regex));

            if (await utils.check(author, guildID, {roles: ['admin', 'mod']}) === false) {
                if (words !== null) {
                    const channel = await message.author.createDM();

                    await message.delete();
                    await channel.send(`Hey! You cannot say \`${words.join(', ')}\` in \`${message.guild.name}\``);
                }
            }
        }

        if (message.content.startsWith('!d bump') && bump !== null) {
            utils.logger.info(`${message.channel.id} ${message.author.tag}: !d bump`);
            dev['bump'].execute(message, utils);
            return;
        }

        if (!message.content.startsWith(process.env.prefix) || dev[command] === undefined) return;

        let log = `${process.env.prefix}${command}`;

        if (command === 'dev' || command === 'git') log += ` ${args[0]}`;
        utils.logger.info(`${message.channel.id} ${message.author.tag}: ${log}`);

        dev[command].execute(message, args, utils, cache);

    } catch (err) {
        utils.logger.error(err);
    }
};
