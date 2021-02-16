/**
 * @param {import('../../types').Interaction} command
 * @param {import('../../types').Utils} utils
 */
module.exports.execute = async (command, utils) => {
    try {
        const options = command.data.options[0].value;

        let choices = options.split(/ +/);
        if (options.includes(',')) choices = options.split(/,\s+/);

        command.send(choices[Math.floor(Math.random() * choices.length)]);

    } catch (err) {
        command.send(`${utils.constants.emojis.redX} ${err.name}: \`${err.message}\``, {type: 3, flags: 64});
        utils.logger.error(err);
    }
};