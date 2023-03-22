const { SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js');
const { birthdays, logger } = require('../utils');
const schedule = require('node-schedule');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('birthday')
        .setDescription('Set your birthday')
        .addIntegerOption(option =>
            option.setName('month')
                .setDescription('The month of your birthday')
                .setRequired(true)
                .addChoices(
                    { name: 'January', value: 1 },
                    { name: 'February', value: 2 },
                    { name: 'March', value: 3 },
                    { name: 'April', value: 4 },
                    { name: 'May', value: 5 },
                    { name: 'June', value: 6 },
                    { name: 'July', value: 7 },
                    { name: 'August', value: 8 },
                    { name: 'September', value: 9 },
                    { name: 'October', value: 10 },
                    { name: 'November', value: 11 },
                    { name: 'December', value: 12 }
                ))
        .addIntegerOption(option =>
            option.setName('day')
                .setDescription('The day of your birthday')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(31)),

    /** @param {ChatInputCommandInteraction} interaction */
    async execute(interaction) {
        try {
            if (interaction.guild.id !== '396523509871935489') {
                interaction.reply({ content: 'This command cannot be used in this server', ephemeral: true });
                return;
            }

            const channel = /** @type {import('discord.js').TextChannel} */ (interaction.client.channels.cache.get('405147700825292827'));
            const month = interaction.options.getInteger('month');
            const day = interaction.options.getInteger('day');

            const birthday = await birthdays.create({
                userId: interaction.user.id,
                month: month,
                day: day
            });

            await birthday.save();
            await interaction.reply(`Your birthday has been set to **${month}/${day}**`);

            schedule.scheduleJob(`0 7 ${day} ${month} *`, async () => {
                try {
                    await channel.send(`Hello <@396534463489769475>! Today is ${interaction.user.toString()}'s birthday!`);

                } catch (err) {
                    logger.error(err.stack);
                }
            });

        } catch (err) {
            logger.error(err.stack);
        }
    }
};
