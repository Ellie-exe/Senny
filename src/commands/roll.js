module.exports = {
    /** @param {import('discord.js/typings').CommandInteraction} command */
    async execute(command) {
        try {
            const dice = command.options.getString('sides');

            if (dice.includes('d')) {
                const die = dice.split('d');
                const count = die[0];
                const sides = die[1];

                if (count < 0) return await command.reply('Cannot roll negative dice');
                if (sides < 0) return await command.reply('Cannot roll dice with negative sides');
                if (!count) return await command.reply('Cannot roll zero dice');
                if (!sides) return await command.reply('Cannot roll dice with zero sides');
                if (count % 1 !== 0) return await command.reply('Cannot roll partial dice');
                if (sides % 1 !== 0) return await command.reply('Cannot roll dice with partial sides');

                let rolls = [];
                let total = 0;

                for (let i = 0; i < count; i++) {
                    const roll = Math.floor(Math.random() * sides + 1);

                    rolls.push(roll);
                    total += roll;
                }

                await command.reply(`You rolled a **${rolls.join(', ')}** for a total of **${total}**`);

            } else {
                const roll = Math.floor(Math.random() * dice + 1);

                if (dice < 0) return await command.reply('Cannot roll a die with negative sides');
                if (!dice) return await command.reply('Cannot roll a die with zero sides');
                if (dice % 1 !== 0) return await command.reply('Cannot roll a die with partial sides');

                await command.reply(`You rolled a **${roll}**`);
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
    ]
};
