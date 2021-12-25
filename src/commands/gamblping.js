module.exports = {
    /** @param {import('discord.js/typings').CommandInteraction} command */
    async execute(command) {
        try {
            const subcommand = command.options.getSubcommand();
            const users = sequelize.define('gamblping', {
                userId: {type: DataTypes.STRING(20), primaryKey: true},
                balance: DataTypes.DOUBLE
            });

            if (subcommand === 'bet') {
                const sent = await command.reply({content: 'Pinging...', fetchReply: true});
                const ping = sent.createdTimestamp - command.createdTimestamp;

                const wager = command.options.getNumber('wager');
                const guess = command.options.getInteger('guess');

                const bank = await users.findOne({where: {userId: 'bank'}});
                let user = await users.findOne({where: {userId: command.user.id}});

                if (!user) {
                    await users.update({balance: bank.balance - 1000}, {where: {userId: 'bank'}});
                    user = await users.create({userId: command.user.id, balance: 1000});
                }

                if (user.balance < wager) return command.editReply('You do not have enough money for that bet');

                const difference = Math.abs(ping - guess);
                let winnings = 0;

                if (difference > 50) {
                    let userBalance = user.balance - wager;
                    let bankBalance = bank.balance + wager;

                    if (userBalance < 10) {
                        const boost = 10 - userBalance;

                        userBalance += boost;
                        bankBalance -= boost;
                    }

                    await users.update({balance: bankBalance}, {where: {userId: 'bank'}});
                    await users.update({balance: userBalance}, {where: {userId: command.user.id}});
                    await command.editReply(`Pong! Took **${ping} ms** Guessed **${guess} ms** Lost **$${wager.toFixed(2)}**`);

                } else {
                    winnings = Math.round((wager * ((50 - difference) / 50)) * 100) / 100;

                    await users.update({balance: bank.balance - winnings}, {where: {userId: 'bank'}});
                    await users.update({balance: user.balance + winnings}, {where: {userId: command.user.id}});
                    await command.editReply(`Pong! Took **${ping} ms** Guessed **${guess} ms** Won **$${winnings.toFixed(2)}**`);
                }

            } else if (subcommand === 'balance') {
                const user = command.options.getUser('user') || command.user;
                let userData = await users.findOne({where: {userId: user.id}});
                await command.reply('Checking...');

                if (!userData) return await command.editReply(`${user.toString()} does not have a balance`);
                await command.editReply(`${user.toString()}'s balance is **$${userData.balance.toFixed(2)}**`);

            } else if (subcommand === 'leaderboard') {
                const userList = await users.findAll({order: [['balance', 'DESC']]});
                userList.shift();

                const embed = new discord.MessageEmbed()
                    .setTitle('Gamblping Leaderboard')
                    .setDescription(userList.map((u, i) =>
                        `${i + 1}. ${client.users.cache.get(u.userId).toString()} - $${u.balance.toFixed(2)}`)
                    .join('\n'))
                    .setColor(0x2F3136);

                await command.reply({embeds: [embed]});
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
                    description: 'Check a user\'s balance',
                    options: [
                        {
                            type: 'USER',
                            name: 'user',
                            description: 'The user to check'
                        }
                    ]
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'leaderboard',
                    description: 'Check the leaderboard'
                }
            ]
        }
    ],

    flags: {
        developer: false,
        guild: '396523509871935489'
    }
};
