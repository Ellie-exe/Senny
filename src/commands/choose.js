/**
 * Choose a random option from a list of options
 * @param {import('../../types').Interaction} command
 */
module.exports.execute = async (command) => {
    try {
        const options = command.data.options[0].value; // The list of options to choose from

        // Split the options by space, or if the options contain a comma, split by comma
        let choices = options.split(/ +/);
        if (options.includes(',')) choices = options.split(/\s*,\s*/);

        // Pick and send a random choice from the list
        command.send(choices[Math.floor(Math.random() * choices.length)]);

    } catch (err) {
        // Log any errors
        command.error(err);
    }
};
