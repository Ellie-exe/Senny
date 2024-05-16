const { SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js');
const { logger } = require('../utils');

module.exports = {
    guild: null,
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Rolls a dice')
        .addIntegerOption(option =>
            option.setName('number')
                .setDescription('The number of dice to roll'))
        .addIntegerOption(option =>
            option.setName('sides')
                .setDescription('The number of sides on the dice')),

    /** @param {ChatInputCommandInteraction} interaction */
    async execute(interaction) {
        try {
            const number = interaction.options.getInteger('number') || 1;
            const sides = interaction.options.getInteger('sides') || 6;
            const rolls = [];

            for (let i = 0; i < number; i++) {
                rolls.push(Math.floor(Math.random() * sides) + 1);
            }

            await interaction.reply(`You rolled **${rolls.join(', ')}** for a total of **${rolls.reduce((a, b) => a + b, 0)}**`);

        } catch (err) {
            logger.error(err.stack);
        }
    }
};
