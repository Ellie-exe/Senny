const { SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js');
const { logger } = require('../utils');

module.exports = {
    guild: null,
    data: new SlashCommandBuilder()
        .setName('emoji')
        .setDescription('Get the image of an emoji')
        .setIntegrationTypes([0, 1])
        .setContexts([0, 1, 2])
        .addStringOption(option =>
            option.setName('emoji')
                .setDescription('The emoji to get the image of')
                .setRequired(true)),

    /** @param {ChatInputCommandInteraction} interaction */
    async execute(interaction) {
        try {
            const emoji = interaction.options.getString('emoji');
            const emojiId = emoji.match(/(?<=:)\d+(?=>)/)[0];
            const fileType = emoji.startsWith('<a:') ? 'gif' : 'png';

            await interaction.reply(`https://cdn.discordapp.com/emojis/${emojiId}.${fileType}`);

        } catch (err) {
            logger.error(err.stack);
        }
    }
};
