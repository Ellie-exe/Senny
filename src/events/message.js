const parseRegex = require('regex-parser');
/**
 * Fires every time a message is sent
 * @param {import('discord.js').Message} message
 * @param {import('../utils')} utils
 * @param {import('redis').RedisClient} cache
 */
module.exports = async (message, commands, utils, cache) => {
    try {
        // Split the message up by greedy spaces, then separate the command and args into separate lists
        const args = message.content.slice(process.env.prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();

        // Make sure the bot can only respond to users
        if (message.author.bot) return;

        // Check the cache to see if a guild has a filter or bump reminder set
        // I'm using a cache because making database calls on every message is a bad idea
        // Learned that the hard way when I couldn't stop the bot from sending errors in chat
        const regex = await cache.hgetAsync(message.guild.id, 'regex');
        const bump = await cache.hgetAsync(message.guild.id, 'bump');

        // If the guild does have a filter set and it is in the cache
        if (regex !== null) {
            // Get the message author and guild ID
            // Author has to be fetched because members are not always cached
            const author = await message.guild.members.fetch(message.author.id);
            const guildID = message.guild.id;

            // Get a list of all filtered words
            // Gotta use parseRegex here because the regex is stored as a string
            const words = message.content.match(parseRegex(regex));

            // Check and ignore if the author is an admin or mod
            if (await utils.check(author, guildID, {roles: ['admin', 'mod']}) === false) {
                // If there are indeed filtered words in the author's message
                if (words !== null) {
                    // Open a DM with the author
                    const channel = await message.author.createDM();

                    // Delete the author's message and DM them to let them know they did an oopsie
                    await message.delete();
                    await channel.send(`Hey! You cannot say \`${words.join(', ')}\` in \`${message.guild.name}\``);
                }
            }
        }

        // Check if someone is trying to use the bump command
        // The bump command has a unique prefix and therefor needs it's own handler
        // Also check if the guild has the bump reminder setting turned on
        if (message.content.startsWith('!d bump') && bump !== null) {
            // If everything checks out then log and execute the command like normal
            utils.logger.info(`${message.channel.id} ${message.author.tag}: !d bump`);
            commands['bump'].execute(message, utils);
            return;
        }

        // Check to make sure the message is a command
        // That's down here because the filter and bump reminder command are not listed as commands
        if (!message.content.startsWith(process.env.prefix) || commands[command] === undefined) return;

        let log = `${process.env.prefix}${command}`; // The command used

        // Add the dev and git commands' subcommands, then log the command used
        if (command === 'dev' || command === 'git') log += ` ${args[0]}`;
        utils.logger.info(`${message.channel.id} ${message.author.tag}: ${log}`);

        // Finally execute the command
        // These should only be dev commands as all user facing commands are slash commands
        commands[command].execute(message, args, utils, cache);

    } catch (err) {
        // Log the error but don't send it in chat, each dev command has it's own chat errors
        utils.logger.error(err);
    }
};
