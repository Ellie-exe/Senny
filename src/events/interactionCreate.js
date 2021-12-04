module.exports = {
    name: 'interactionCreate',
    /** @param {import('discord.js/typings').CommandInteraction} interaction */
    async execute(interaction) {
        try {
            const command = client.commands.get(interaction.commandName);

            logger.info(`${interaction.channelId} ${interaction.user.tag}: /${interaction.commandName}`);
            await command.execute(interaction);

        } catch (err) {
            logger.error(err);
        }
    }
};
