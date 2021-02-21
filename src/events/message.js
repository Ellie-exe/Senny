const parseRegex = require('regex-parser');
/**
 * @param {import('../../types').Message} message
 * @param {import('../../types').Utils} utils
 * @param {import('../../types').Cache} cache
 */
module.exports = async (message, commands, utils, cache) => {
    try {
        const args = message.content.slice(process.env.prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();

        if (message.author.bot) return;

        let regex = undefined;
        let bump = undefined;
        cache.hget(message.guild.id, 'regex', function(err, value) {regex = value});
        cache.hget(message.guild.id, 'bump', function(err, value) {bump = value});

        if (regex !== undefined) {
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

        if (message.content.startsWith('!d bump') && bump !== undefined) {
            utils.logger.info(`${message.channel.id} ${message.author.tag}: !d bump`);
            commands['bump'].execute(message, utils);
            return;
        }

        if (!message.content.startsWith(process.env.prefix) || commands[command] === undefined) return;

        if (command === 'dev' || command === 'git') {
            utils.logger.info(`${message.channel.id} ${message.author.tag}: ${process.env.prefix}${command} ${args[0]}`);

        } else {
            utils.logger.info(`${message.channel.id} ${message.author.tag}: ${process.env.prefix}${command}`);
        }

        commands[command].execute(message, args, utils);

    } catch (err) {
        utils.logger.error(err);
    }
}
