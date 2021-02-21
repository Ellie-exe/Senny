/**
 * @param {import('../../types').Interaction} command
 */
module.exports.execute = async (command) => {
    try {
        const options = command.data.options[0].value;

        let choices = options.split(/ +/);
        if (options.includes(',')) choices = options.split(/\s*,\s*/);

        command.send(choices[Math.floor(Math.random() * choices.length)]);

    } catch (err) {
        command.error(err);
    }
};
