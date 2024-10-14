const { SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js');
const { logger } = require('../utils');

module.exports = {
    guild: null,
    data: new SlashCommandBuilder()
        .setName('convert')
        .setDescription('Converts a number from one unit to another')
        .setIntegrationTypes([0, 1])
        .setContexts([0, 1, 2])
        .addNumberOption(option =>
            option.setName('number')
                .setDescription('The number to convert')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('from')
                .setDescription('The unit to convert from')
                .setRequired(true)
                .addChoices(
                    { name: 'fahrenheit', value: 'f' },
                    { name: 'celsius', value: 'c' },
                    { name: 'inches', value: 'in' },
                    { name: 'feet', value: 'ft' },
                    { name: 'yards', value: 'yd' },
                    { name: 'miles', value: 'mi' },
                    { name: 'meters', value: 'm' },
                ))
        .addStringOption(option =>
            option.setName('to')
                .setDescription('The unit to convert to')
                .setRequired(true)
                .addChoices(
                    { name: 'fahrenheit', value: 'f' },
                    { name: 'celsius', value: 'c' },
                    { name: 'inches', value: 'in' },
                    { name: 'feet', value: 'ft' },
                    { name: 'yards', value: 'yd' },
                    { name: 'miles', value: 'mi' },
                    { name: 'meters', value: 'm' },
                )),

    /** @param {ChatInputCommandInteraction} interaction */
    async execute(interaction) {
        try {
            const from = interaction.options.getString('from');
            const to = interaction.options.getString('to');

            let number = interaction.options.getInteger('number');

            const conversions = {
                fc: (number - 32) * 5 / 9,
                cf: number * 9 / 5 + 32,
                inft: number / 12,
                inyd: number / 12 / 3,
                inmi: number / 12 / 3 / 1760,
                inm: number / 39.37,
                ftin: number * 12,
                ftyd: number / 3,
                ftmi: number / 3 / 1760,
                ftm: number * 12 / 39.37,
                ydin: number * 3 * 12,
                ydft: number * 3,
                ydmi: number / 1760,
                ydm: number * 3 * 12 / 39.37,
                miin: number * 1760 * 3 * 12,
                mift: number * 1760 * 3,
                miyd: number * 1760,
                mim: number * 1760 * 3 * 12 / 39.37,
            }

            const result = Math.round(conversions[from + to] * 100) / 100;

            if (result) {
                await interaction.reply(`${number} ${from} is ${result} ${to}`);

            } else {
                await interaction.reply(`Sorry, I don't know how to convert ${from} to ${to}`);
            }

        } catch (err) {
            logger.error(err.stack);
        }
    }
};
