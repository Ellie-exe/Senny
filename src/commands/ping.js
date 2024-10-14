const { SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js');
const { logger } = require('../utils');

module.exports = {
    guild: null,
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!')
        .setIntegrationTypes([0, 1])
        .setContexts([0, 1, 2]),

    /** @param {ChatInputCommandInteraction} interaction */
    async execute(interaction) {
        try {
            const message = await interaction.reply({content: 'Pinging...', fetchReply: true});
            const ping = message.createdTimestamp - interaction.createdTimestamp;
            await interaction.editReply(`Pong! Took **${ping} ms**`);

        } catch (err) {
            logger.error(err.stack);
        }
    }
};
