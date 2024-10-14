const { SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js');
const { logger } = require('../utils');

module.exports = {
    guild: null,
    data: new SlashCommandBuilder()
        .setName('flip')
        .setDescription('Flips a coin')
        .setIntegrationTypes([0, 1])
        .setContexts([0, 1, 2]),

    /** @param {ChatInputCommandInteraction} interaction */
    async execute(interaction) {
        try {
            const coin = Math.random() < 0.5 ? 'heads' : 'tails';
            await interaction.reply(`You flipped **${coin}**`);

        } catch (err) {
            logger.error(err.stack);
        }
    }
};
