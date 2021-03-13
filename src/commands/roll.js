/**
 * Rolls a dice in normal or NdN format
 * @param {import('../utils').Interaction} command
 */
module.exports.execute = async (command) => {
    try {
        const dice = command.data.options[0].value; // User input

        // If user uses NdN format
        if (dice.includes('d')) {
            // Separate modifier and sides
            const die = dice.split('d');
            const num = die[0];
            const sides = die[1];

            // Make sure the dice are valid
            if (num < 0 || sides < 0) throw new Error('Cannot roll negative dice');
            if (num === 0 || sides === 0) throw new Error('Cannot roll zero dice');
            if (num % 1 !== 0 || sides % 1 !== 0) throw new Error('Cannot roll partial dice');

            const rolls = []; // List of all rolls
            let total = 0; // Sum of all rolls

            // Roll the die the specified number of times
            for (let i = 0; i < num; i++) {
                const roll = Math.floor(Math.random() * sides + 1);

                rolls.push(roll); // Add the roll to the list of rolls
                total += roll; // Add the roll value to the total
            }

            // Send the total and the list of rolls
            command.send(`${total} \`[${rolls.join(', ')}]\``);

        // If the user does not use NdN format
        } else {
            // Generate a random number between 1 and the number of sides
            const roll = Math.floor(Math.random() * dice + 1);

            // Make sure the die is valid
            if (dice < 0) throw new Error('Cannot roll a negative die');
            if (dice === 0) throw new Error('Cannot roll zero die');
            if (dice % 1 !== 0) throw new Error('Cannot roll a partial die');

            // Send the roll
            command.send(roll);
        }

    } catch (err) {
        // Log any errors
        command.error(err);
    }
};
