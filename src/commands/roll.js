module.exports = {
    /** @param {import('discord.js/typings').CommandInteraction} command */
    async execute(command) {
        try {
            const input = command.options.getString('sides');

            if (input.includes('d')) {
                const rolls = input.split(/\s*\+\s*/g);

                let total = 0;
                let result = [];

                rolls.forEach(roll => {
                    if (roll.includes('d')) {
                        const dice = roll.split(/\s*d\s*/);
                        const num = dice[0] || 1;
                        const sides = dice[1];

                        for (let i = 0; i < num; i++) {
                            const value = Math.floor(Math.random() * sides) + 1;

                            result.push(value);
                            total += value;
                        }

                    } else {
                        total += roll;
                    }
                });

                await command.reply(`You rolled a **${result.join(', ')}** for a total of **${total}**`);

            } else {
                await command.reply(`You rolled a **${Math.floor(Math.random() * input) + 1}**`);
            }

        } catch (err) {
            logger.error(err);
        }
    },

    data: [
        {
            type: 'CHAT_INPUT',
            name: 'roll',
            description: 'Roll a virtual die (supports NdN format)',
            options: [
                {
                    type: 'STRING',
                    name: 'sides',
                    description: 'The number of sides of the die',
                    required: true
                }
            ]
        }
    ],

    flags: {
        developer: false,
        guild: false
    }
};
