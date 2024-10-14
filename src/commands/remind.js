const { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } = require('discord.js');
const { scheduleJob } = require('node-schedule');
const { reminders, logger } = require('../utils');

module.exports = {
    guild: null,
    data: new SlashCommandBuilder()
        .setName('remind')
        .setDescription('Reminds you of something')
        .setIntegrationTypes([0, 1])
        .setContexts([0, 1, 2])
        .addSubcommand(subcommand => subcommand
            .setName('at')
            .setDescription('Remind you at a date and time')
            .addStringOption(option => option
                .setName('date')
                .setDescription('The date and time to remind you at')
                .setRequired(true))
            .addStringOption(option => option
                .setName('message')
                .setDescription('The message to remind you of')
                .setRequired(true))
            .addChannelOption(option => option
                .setName('channel')
                .setDescription('The channel to remind you in')
                .setRequired(false))
            .addUserOption(option => option
                .setName('user')
                .setDescription('The user to remind')
                .setRequired(false)))
        .addSubcommand(subcommand => subcommand
            .setName('in')
            .setDescription('Remind you in a duration')
            .addStringOption(option => option
                .setName('time')
                .setDescription('The duration to remind you in')
                .setRequired(true))
            .addStringOption(option => option
                .setName('message')
                .setDescription('The message to remind you of')
                .setRequired(true))
            .addChannelOption(option => option
                .setName('channel')
                .setDescription('The channel to remind you in')
                .setRequired(false))
            .addUserOption(option => option
                .setName('user')
                .setDescription('The user to remind')
                .setRequired(false)))
        .addSubcommand(subcommand => subcommand
            .setName('list')
            .setDescription('List your reminders'))
        .addSubcommand(subcommand => subcommand
            .setName('delete')
            .setDescription('Delete a reminder')
            .addStringOption(option => option
                .setName('id')
                .setDescription('The id of the reminder to delete')
                .setRequired(true))),

    /** @param {ChatInputCommandInteraction} interaction */
    async execute(interaction) {
        try {
            const subcommand = interaction.options.getSubcommand();

            if (subcommand === 'list') {
                const reminderList = await reminders.find({ authorId: interaction.user.id }).exec();
                const embed = new EmbedBuilder()
                    .setColor(0x2F3136)
                    .setTitle(`Reminders for ${interaction.member?.displayName ?? interaction.user.globalName}`);

                let description = '';
                let count = 1;

                if (reminderList.length === 0) {
                    description = 'You have no reminders!';
                }

                for (const reminder of reminderList) {
                    const offset = Math.floor(Math.random() * 18);
                    const reminderId = reminder.id.substring(offset, offset + 7);
                    const channel = await interaction.client.channels.fetch(/** @type String */ reminder.destinationId);
                    const info = `\`${reminderId}\` <t:${Math.round(reminder.endTimestamp / 1000)}:R> ${channel.toString()}`;

                    description += `${count}. \`${reminderId}\` - **"${reminder.message}"**\n   \u200b<t:${Math.round(reminder.endTimestamp / 1000)}:R> ${channel.toString()}`;
                    if (count < reminderList.length) { description += '\n\n'; }

                    count++;
                }

                embed.setDescription(description);

                await interaction.reply({ embeds: [embed] });
                return;
            }

            if (subcommand === 'delete') {
                const id = interaction.options.getString('id');
                const reminder = await reminders.findOne({ id: new RegExp(id) }).exec();

                if (!reminder) {
                    await interaction.reply('Reminder not found!');
                    return;
                }

                if (reminder.authorId !== interaction.user.id) {
                    await interaction.reply('You can only delete your own reminders!');
                    return;
                }

                await reminder.delete();
                await interaction.reply('Reminder deleted!');
                return;
            }

            const user = interaction.options.getUser('user');
            const channel = await user?.createDM() ?? interaction.options.getChannel('channel') ?? interaction.channel;

            if (interaction.context === 2 && channel === null) {
                await interaction.reply('You need to specify a destination!');
                const error = new Error('Invalid destination');
                logger.error(error.stack);

                return;
            }

            let timestamp = Date.now();

            if (subcommand === 'at') {
                timestamp = Date.parse(interaction.options.getString('date'));

                if (isNaN(timestamp)) {
                    await interaction.reply('Invalid date!');

                    const error = new Error('Invalid date');
                    logger.error(error.stack);

                    return;
                }
            }

            if (subcommand === 'in') {
                const timeString = interaction.options.getString('time');
                const times = timeString.match(/\d+\s*\w+/g);

                let duration = 0;

                for (const time of times) {
                    const value = time.match(/\d+/g)[0];
                    const label = time.match(/(?<=\s|\d)(mo|[ywdhms])/gi)[0];

                    const conversions = {
                        y: value * 365 * 24 * 60 * 60 * 1000,
                        mo: value * 30 * 24 * 60 * 60 * 1000,
                        w: value * 7 * 24 * 60 * 60 * 1000,
                        d: value * 24 * 60 * 60 * 1000,
                        h: value * 60 * 60 * 1000,
                        m: value * 60 * 1000,
                        s: value * 1000
                    };

                    duration += conversions[label];
                }

                timestamp += duration;
            }

            const reminder = await reminders.create({
                authorString: interaction.user.id === user?.id ? 'You' : interaction.user.toString(),
                destinationString: user !== null ? 'you' : channel.toString(),
                message: interaction.options.getString('message'),
                authorId: interaction.user.id,
                destinationId: channel.id,
                startTimestamp: Date.now(),
                endTimestamp: timestamp
            });

            reminder.id = reminder._id;
            await reminder.save();

            scheduleJob(timestamp, async () => {
                try {
                    const r = await reminders.findOne({ _id: reminder.id }).exec();
                    if (!r) return;

                    const message = `Hello! ${r.authorString} asked me to remind ${r.destinationString} ` +
                        `about **"${r.message}"** <t:${Math.round(r.startTimestamp / 1000)}:R>`;

                    await channel.send(message);
                    await r.delete();

                } catch (err) {
                    logger.error(err.stack);
                }
            });

            const response = `Okay ${interaction.user.toString()}! I'll remind ` +
                `${interaction.user.id === user?.id ? 'you' : channel.toString()} about ` +
                `**"${interaction.options.getString('message')}"** <t:${Math.round(timestamp / 1000)}:R>`;

            interaction.reply(response);

        } catch (err) {
            logger.error(err.stack);
        }
    }
};
