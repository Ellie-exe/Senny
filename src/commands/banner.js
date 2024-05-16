const { SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js');
const { logger } = require('../utils');

module.exports = {
    guild: null,
    data: new SlashCommandBuilder()
        .setName('banner')
        .setDescription('Get the banner of a user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to get the banner of')),

    /** @param {ChatInputCommandInteraction} interaction */
    async execute(interaction) {
        try {
            const user = await interaction.options.getUser('user')?.fetch() ?? await interaction.user.fetch();
            const banner = user.bannerURL({extension: 'png', size: 4096});
            await interaction.reply(banner);

        } catch (err) {
            logger.error(err.stack);
        }
    }
};
