const { SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js');
const { logger } = require('../utils');

module.exports = {
    guild: null,
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Get the avatar of a user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to get the avatar of')),

    /** @param {ChatInputCommandInteraction} interaction */
    async execute(interaction) {
        try {
            const user = interaction.options.getUser('user') ?? interaction.user;
            const avatar = user.displayAvatarURL({extension: 'png', size: 4096});
            await interaction.reply(avatar);

        } catch (err) {
            logger.error(err.stack);
        }
    }
};
