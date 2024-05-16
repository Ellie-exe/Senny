const { SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js');
const { logger } = require('../utils');

module.exports = {
    guild: null,
    data: new SlashCommandBuilder()
        .setName('choose')
        .setDescription('Choose between multiple options')
        .addStringOption(option =>
            option.setName('options')
                .setDescription('The comma separated options to choose from')
                .setRequired(true)),

    /** @param {ChatInputCommandInteraction} interaction */
    async execute(interaction) {
        try {
            const options = interaction.options.getString('options').split(',');
            const choice = options[Math.floor(Math.random() * options.length)];
            await interaction.reply(`Between **"${options.join(', ')}"** I choose **${choice}**`);

        } catch (err) {
            logger.error(err.stack);
        }
    }
};
