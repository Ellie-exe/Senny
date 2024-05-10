const { SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js');
const { questions, logger } = require('../utils');

module.exports = {
    guildId: 'global',
    data: new SlashCommandBuilder()
        .setName('qotd')
        .setDescription('Question of the day commands')
        .addSubcommand(subcommand => subcommand
            .setName('send')
            .setDescription('Sends a new question of the day')
            .addStringOption(option => option
                .setName('message')
                .setDescription('An optional message to send with the question')
                .setRequired(false)))
        .addSubcommand(subcommand => subcommand
            .setName('add')
            .setDescription('Adds a new question of the day')
            .addStringOption(option => option
                .setName('question')
                .setDescription('The question to add')
                .setRequired(true))),

    /** @param {ChatInputCommandInteraction} interaction */
    async execute(interaction) {
        try {
            const subcommand = interaction.options.getSubcommand();

            if (subcommand === 'send') {
                if (interaction.user.id !== '468854398806654976') {
                    await interaction.reply('You do not have permission to use this command.');
                    return;
                }

                const message = interaction.options.getString('message');
                interaction.client.emit('questionOfTheDay', interaction.client, message);
                await interaction.reply('Question of the day sent!');

            } else if (subcommand === 'add') {
                const question = interaction.options.getString('question');

                await questions.create({
                    question: question,
                    authorId: interaction.user.id,
                    timestamp: Date.now()
                });

                await interaction.reply('Question of the day added!');
            }

        } catch (err) {
            logger.error(err.stack);
        }
    }
};
