module.exports = {
    /** @param {import('discord.js/typings').CommandInteraction} command */
    async execute(command) {
        try {
            const users = sequelize.define('gamblping', {
                userId: {type: DataTypes.STRING(20), primaryKey: true},
                balance: DataTypes.DOUBLE
            });

            await users.sync();

            let bank = await users.findOne({where: {userId: 'bank'}});
            if (!bank) bank = await users.create({userId: 'bank', balance: 1000000000000});

            let user = await users.findOne({where: {userId: command.user.id}});
            if (!user) {
                await users.update({balance: bank.balance - 1000}, {where: {userId: 'bank'}});
                user = await users.create({userId: command.user.id, balance: 1000});
            }

            const subcommand = command.options.getSubcommand();
            if (subcommand === 'bet') {
                const sent = await command.reply({content: 'Pinging...', fetchReply: true});
                const ping = sent.createdTimestamp - command.createdTimestamp;

                const wager = command.options.getNumber('wager');
                const guess = command.options.getInteger('guess');

                if (user.balance < wager) return command.editReply('You do not have enough money for that bet');

                const diff = Math.abs(ping - guess);
                let winnings = 0;

                if (diff > 50) {
                    await users.update({balance: bank.balance + wager}, {where: {userId: 'bank'}});
                    await users.update({balance: user.balance - wager}, {where: {userId: command.user.id}});
                    await command.editReply(`Pong! Took **${ping} ms** and you guessed **${guess} ms** meaning you lost **$${wager}**`);

                } else {
                    winnings = wager * ((50 - diff) / 50);

                    await users.update({balance: bank.balance - winnings}, {where: {userId: 'bank'}});
                    await users.update({balance: user.balance + winnings}, {where: {userId: command.user.id}});
                    await command.editReply(`Pong! Took **${ping} ms** and you guessed **${guess} ms** meaning you won **$${winnings}**`);
                }

            } else if (subcommand === 'balance') {
                await command.reply(`Your balance is **$${user.balance}**`);
            }

        } catch (err) {
            logger.error(err);
        }
    },

    data: [
        {
            type: 'CHAT_INPUT',
            name: 'gamblping',
            description: 'Gamble on your ping',
            options: [
                {
                    type: 'SUB_COMMAND',
                    name: 'bet',
                    description: 'Place a bet',
                    options: [
                        {
                            type: 'NUMBER',
                            name: 'wager',
                            description: 'How much you want to bet',
                            required: true
                        },
                        {
                            type: 'INTEGER',
                            name: 'guess',
                            description: 'What number you want to bet on',
                            required: true
                        }
                    ]
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'balance',
                    description: 'Check your balance',
                }
            ]
        }
    ],

    flags: {
        developer: false,
        guild: '396523509871935489'
    }
};
