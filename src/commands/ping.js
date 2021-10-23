module.exports = {
    data: new SlashCommand()
        .setName('png')
        .setDescription('Get the bot\'s ping'),

    /** @param {import('discord.js/typings').CommandInteraction} command */
    async execute(command) {
        try {
            const sent = await command.reply({content: 'Pinging...', fetchReply: true});
            await command.editReply(`Pong! Took ${sent.createdTimestamp - command.createdTimestamp}ms`);

        } catch (err) {
            logger.error(err);
        }
    }
};
