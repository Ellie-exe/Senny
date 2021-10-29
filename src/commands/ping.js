module.exports = {
    /** @param {import('discord.js/typings').CommandInteraction} command */
    async execute(command) {
        try {
            const sent = await command.reply({content: 'Pinging...', fetchReply: true});
            await command.editReply(`Pong! Took ${sent.createdTimestamp - command.createdTimestamp}ms`);

        } catch (err) {
            logger.error(err);
        }
    },

    data: [
        {
            type: 'CHAT_INPUT',
            name: 'ping',
            description: 'Get the bot\'s ping'
        }
    ]
};
