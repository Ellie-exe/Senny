module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        // logger.info(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`);
        logger.info(`${interaction.channelId} ${interaction.user.tag}: /${interaction.commandName}`);
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            logger.error(error);
            await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true});
        }
    },
};
