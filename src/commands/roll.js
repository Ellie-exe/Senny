module.exports = {
    /**
     * @param {import('../utils').Interaction} command
     */
    async execute(command) {
        try {
            const dice = command.data.options[0].value;

            if (dice.includes('d')) {
                const die = dice.split('d');
                const num = die[0];
                const sides = die[1];

                if (num < 0 || sides < 0) throw new Error('Cannot roll negative dice');
                if (num === 0 || sides === 0) throw new Error('Cannot roll zero dice');
                if (num % 1 !== 0 || sides % 1 !== 0) throw new Error('Cannot roll partial dice');

                const rolls = [];
                let total = 0;

                for (let i = 0; i < num; i++) {
                    const roll = Math.floor(Math.random() * sides + 1);

                    rolls.push(roll);
                    total += roll;
                }

                await command.send(`${total} \`[${rolls.join(', ')}]\``);

            } else {
                const roll = Math.floor(Math.random() * dice + 1);

                if (dice < 0) throw new Error('Cannot roll a negative die');
                if (dice === 0) throw new Error('Cannot roll zero die');
                if (dice % 1 !== 0) throw new Error('Cannot roll a partial die');

                await command.send(roll);
            }

        } catch (err) {
            await command.error(err);
        }
    },

    data: {
        name: 'roll',
        description: 'Roll a dice',
        options: [
            {
                name: 'sides',
                description: 'Size of dice (supports NdN format)',
                required: true,
                type: 3
            }
        ]
    }
};
