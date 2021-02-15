const Enmap = require('enmap');
const parseRegex = require('regex-parser');
/**
 * @param {import('../../types').Message} message
 * @param {import('../../types').Utils} utils
 */
module.exports = async (message, commands, utils) => {
    try {
        const args = message.content.slice(process.env.prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();

        if (message.author.bot) return;

        const filter = new Enmap({name: 'filter'});
        const regex = filter.get(message.guild.id);

        if (regex !== undefined) {
            const author = await message.guild.members.fetch(message.author.id);
            const guildID = message.guild.id;

            const words = message.content.match(parseRegex(regex));

            if (await utils.check(author, guildID, {roles: ['admin', 'mod']}) === false) {
                if (words !== null) {
                    
                    await message.delete();
                    await message.author.createDM()
                        .then(async channel => {
                            await channel.send(`Hey! You cannot say \`${words.join(', ')}\` in \`${message.guild.name}\``);
                        });
                }
            }
        }

        const bump = new Enmap({name: 'bump'});
        const setting = bump.get(message.guild.id);

        if (message.content.startsWith('!d bump') && setting !== undefined) {
            utils.logger.info(`${message.channel.id} ${message.author.tag}: !d bump`);
            commands['bump'].execute(message, utils);
            return;
        }

        if (message.content.startsWith(process.env.prefix) === false || commands[command] === undefined) return;

        if (command === 'dev') {
            utils.logger.info(`${message.channel.id} ${message.author.tag}: ${process.env.prefix}${command} ${args[0]}`);
        
        } else {
            utils.logger.info(`${message.channel.id} ${message.author.tag}: ${process.env.prefix}${command}`);
        }

        commands[command].execute(message, args, utils);
        
    } catch (err) {
        message.channel.send(`${utils.constants.emojis.redX} Error: \`${err}\``).catch(err => utils.logger.error(err));
        utils.logger.error(err);
    }
}