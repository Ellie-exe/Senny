/**
 * @param {import('../../types').Interaction} command
 * @param {import('../../types').Utils} utils
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

            command.send(`${total} [\`${rolls.join(', ')}\`]`);

        } else {
            const sides = dice;
            const roll = Math.floor(Math.random() * sides + 1);

            command.send(roll);
        }

    } catch (err) {
        command.send(`${utils.constants.emojis.redX} Error: \`${err}\``, {type: 3, flags: 64});
        utils.logger.error(err);
    }
};