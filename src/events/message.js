const parseRegex = require('regex-parser');
const mariadb = require('mariadb');
/**
 * @param {import('../../types').Message} message
 * @param {import('../../types').Utils} utils
 */
module.exports = async (message, commands, utils) => {
    try {
        const args = message.content.slice(process.env.prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();

        if (message.author.bot) return;

        const conn = await mariadb.createConnection({
            user: process.env.user, 
            password: process.env.password, 
            database: process.env.database
        });

        const regex = await conn.query('SELECT regex FROM filters WHERE guildID=(?)', [message.guild.id]);

        if (regex.length !== 0) {
            const author = await message.guild.members.fetch(message.author.id);
            const guildID = message.guild.id;

            const words = message.content.match(parseRegex(regex[0].regex));

            if (await utils.check(author, guildID, {roles: ['admin', 'mod']}) === false) {
                if (words !== null) {
                    const channel = await message.author.createDM();

                    await message.delete();
                    await channel.send(`Hey! You cannot say \`${words.join(', ')}\` in \`${message.guild.name}\``);
                }
            }
        }

        const bump = await conn.query('SELECT guildID FROM bumpReminders WHERE guildID=(?)', [message.guild.id]);

        if (message.content.startsWith('!d bump') && bump.length !== 0) {
            utils.logger.info(`${message.channel.id} ${message.author.tag}: !d bump`);
            commands['bump'].execute(message, utils);
            return;
        }

        await conn.end();

        if (!message.content.startsWith(process.env.prefix) || commands[command] === undefined) return;

        if (command === 'dev') {
            utils.logger.info(`${message.channel.id} ${message.author.tag}: ${process.env.prefix}${command} ${args[0]}`);
        
        } else {
            utils.logger.info(`${message.channel.id} ${message.author.tag}: ${process.env.prefix}${command}`);
        }

        commands[command].execute(message, args, utils);
        
    } catch (err) {
        message.channel.send(`${utils.constants.emojis.redX} ${err.name}: \`${err.message}\``).catch(err => utils.logger.error(err));
        utils.logger.error(err);
    }
}