/**
 * @param {import('../../types').Interaction} command
 */
module.exports.execute = async (command) => {
    try {
        const dice = command.data.options[0].value;

        if (dice.includes('d')) {
            const die = dice.split('d');
            const modifier = die[0];
            const sides = die[1];

            if (modifier < 0 || sides < 0) throw new Error('Cannot roll negative dice');
            if (modifier === 0 || sides === 0) throw new Error('Cannot roll zero dice');
            if (modifier % 1 !== 0 || sides % 1 !== 0) throw new Error('Cannot roll partial dice');

            const rolls = [];
            let total = 0;

            for (let i = 0; i < modifier; i++) {
                const roll = Math.floor(Math.random() * sides + 1);

                rolls.push(roll);
                total += roll;
            }

            command.send(`${total} \`[${rolls.join(', ')}]\``);

        } else {
            const sides = dice;
            const roll = Math.floor(Math.random() * sides + 1);

            if (sides < 0) throw new Error('Cannot roll negative dice');
            if (sides === 0) throw new Error('Cannot roll zero dice')
            if (sides % 1 !== 0) throw new Error('Cannot roll partial dice');

            command.send(roll);
        }

    } catch (err) {
        command.error(err);
    }
};
