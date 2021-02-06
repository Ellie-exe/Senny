/**
 * @param {import('../types').Interaction} command
 * @param {import('../types').Utils} utils
 */
module.exports.execute = async (command, utils) => {
    try {
        const dice = command.data.options[0].value;

        if (dice.includes('d')) {
            const die = dice.split('d');
            const modifier = die[0];
            const sides = die[1];

            const rolls = [];
            let total = 0;

            for (let i = 0; i < modifier; i++) {
                const roll = Math.floor(Math.random() * sides + 1);
                
                rolls.push(roll);
                total += roll;
            }

            rolls.splice(-1, 1, `and ${rolls[rolls.length - 1]}`);

            var response = `You rolled a: \`${rolls.join(', ')}\`\nFor a total of: \`${total}\``;

        } else {
            const sides = dice;
            const roll = [Math.floor(Math.random() * sides)];

            var response = `You rolled a: \`${roll}\``;
        }
        
        command.send(response);

    } catch (err) {
        command.send(`${utils.constants.emojis.redX} Error: \`${err}\``, {type: 3, flags: 64});
        utils.logger.error(err);
    }
};