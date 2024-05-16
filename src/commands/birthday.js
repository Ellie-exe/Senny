const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder} = require('discord.js');
const { birthdays, logger } = require('../utils');
const schedule = require('node-schedule');

module.exports = {
    guild: '396523509871935489',
    data: new SlashCommandBuilder()
        .setName('birthday')
        .setDescription('Track birthdays in the server')
        .addSubcommand(subcommand =>
            subcommand.setName('set')
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
                        .setMaxValue(31)))
        .addSubcommand(subcommand =>
            subcommand.setName('remove')
                .setDescription('Remove your birthday'))
        .addSubcommand(subcommand =>
            subcommand.setName('list')
                .setDescription('List all birthdays')),

    /** @param {ChatInputCommandInteraction} interaction */
    async execute(interaction) {
        try {
            if (interaction.guild.id !== '396523509871935489') {
                interaction.reply({ content: 'This command cannot be used in this server', ephemeral: true });
                return;
            }

            const subcommand = interaction.options.getSubcommand();

            if (subcommand === 'set') {
                const channel = /** @type {import('discord.js').TextChannel} */ (interaction.client.channels.cache.get('405147700825292827'));
                const month = interaction.options.getInteger('month');
                const day = interaction.options.getInteger('day');

                let birthday = await birthdays.findOne({ userId: interaction.user.id }).exec();

                if (birthday) {
                    birthdays.updateOne({ userId: interaction.user.id }, { month: month, day: day }).exec();
                    await interaction.reply(`Your birthday has been updated to **${month}/${day}**`);

                } else {
                    birthday = await birthdays.create({
                        userId: interaction.user.id,
                        month: month,
                        day: day
                    });

                    await birthday.save();
                    await interaction.reply(`Your birthday has been set to **${month}/${day}**`);
                }

                schedule.scheduleJob(`0 0 ${day} ${month} *`, async () => {
                    try {
                        const birthday = await birthdays.findOne({ month: month, day: day }).exec();
                        if (!birthday) { return; }

                        await channel.send(`Hello <@396534463489769475>! Today is ${interaction.user.toString()}'s birthday!`);

                    } catch (err) {
                        logger.error(err.stack);
                    }
                });

            } else if (subcommand === 'remove') {
                const birthday = await birthdays.findOne({ userId: interaction.user.id }).exec();

                if (!birthday) {
                    await interaction.reply('You do not have a birthday set');
                    return;
                }

                await birthday.delete();
                await interaction.reply('Your birthday has been removed');

            } else if (subcommand === 'list') {
                const months = {
                    1: 'January',
                    2: 'February',
                    3: 'March',
                    4: 'April',
                    5: 'May',
                    6: 'June',
                    7: 'July',
                    8: 'August',
                    9: 'September',
                    10: 'October',
                    11: 'November',
                    12: 'December'
                }

                const birthdayList = await birthdays.find().exec();

                let description = '';
                let count = 1;

                birthdayList.sort((a, b) => {
                    if (a.month < b.month) return -1;
                    if (a.month > b.month) return 1;
                    if (a.day < b.day) return -1;
                    if (a.day > b.day) return 1;
                    return 0;
                });

                for (const birthday of birthdayList) {
                    const user = await interaction.client.users.fetch(/** @type String */ birthday.userId);

                    description += `${count}. ${user.toString()} - ${months[birthday.month]} ${birthday.day}`;
                    if (count < birthdayList.length) description += '\n';

                    count++;
                }

                const embed = new EmbedBuilder()
                    .setTitle('Birthdays')
                    .setDescription(description);

                await interaction.reply({ embeds: [embed] });
            }

        } catch (err) {
            logger.error(err.stack);
        }
    }
};
