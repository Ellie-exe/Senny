const { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } = require('discord.js');
const { accounts } = require('../utils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gamble')
        .setDescription('Gamble your money away!')
        .addSubcommand(subcommand =>
            subcommand.setName('bet')
                .setDescription('Bet your money on a number')
                .addIntegerOption(option =>
                    option.setName('amount')
                        .setDescription('The amount of money to bet')
                        .setRequired(true)
                        .setMinValue(0))
                .addIntegerOption(option =>
                    option.setName('guess')
                        .setDescription('Guess a number between 0 and 100')
                        .setRequired(true)
                        .setMinValue(0)
                        .setMaxValue(100)))
        .addSubcommand(subcommand =>
            subcommand.setName('balance')
                .setDescription('Check your balance')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('The user to check the balance of')))
        .addSubcommand(subcommand =>
            subcommand.setName('leaderboard')
                .setDescription('Check the leaderboard')),

    /** @param {ChatInputCommandInteraction} interaction */
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'balance') {
            const user = interaction.options.getUser('user');
            const account = await accounts.findOne({ userId: user ?? interaction.user.id }).exec();

            if (!account) {
                await interaction.reply('That user has no balance!');
                return;
            }

            await interaction.reply(`${user !== null ? user.toString() + "'s" : 'Your'} balance is $${account.balance}`);
            return;
        }

        if (subcommand === 'leaderboard') {
            const embed = new EmbedBuilder()
                .setColor(0x2F3136)
                .setTitle('Gambling Leaderboard');

            const accountList = await accounts.find().sort({ balance: -1 }).exec();

            let description = '';
            let count = 1;

            for (const account of accountList) {
                const user = await interaction.client.users.fetch(/** @type String */ account.userId);

                description += `**${count}. ${user.username}**: $${account.balance}\n`;
                count++;
            }

            embed.setDescription(description);
            await interaction.reply({ embeds: [embed] });
            return;
        }

        let account = await accounts.findOne({ userId: interaction.user.id }).exec();
        if (!account) { account = await accounts.create({ userId: interaction.user.id, balance: 100 }); }

        const number = Math.floor(Math.random() * 101);

        const wager = interaction.options.getInteger('amount');
        const guess = interaction.options.getInteger('guess');

        const difference = Math.abs(number - guess);
        let response = `The number was **${number}** and you guessed **${guess}**. `

        if (difference > 7) {
            account.balance -= wager;
            await account.save();
            response += `You lost: **$${wager}**!`;

        } else if (difference !== 0) {
            account.balance += wager;
            await account.save();
            response += `You won: **$${wager}**!`;

        } else {
            account.balance += wager * 2;
            await account.save();
            response += `You won double: **$${wager}**!`;
        }

        await interaction.reply(response);
    }
};
