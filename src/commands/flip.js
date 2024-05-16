const { SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js');
const { logger } = require('../utils');

module.exports = {
    guild: null,
    data: new SlashCommandBuilder()
        .setName('flip')
        .setDescription('Flips a coin'),

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
