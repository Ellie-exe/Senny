module.exports = {
    /**
     * Choose a random option from a list of options
     * @param {import('../utils').Interaction} command
     */
    async execute(command) {
        try {
            // The list of options to choose from
            const options = command.data.options[0].value;

            // Split the options by space, or if the options contain a comma, split by comma
            let choices = options.split(/ +/);
            if (options.includes(',')) choices = options.split(/\s*,\s*/);

            // Pick and send a random choice from the list
            command.send(choices[Math.floor(Math.random() * choices.length)]);

        } catch (err) {
            // Log any errors
            command.error(err);
        }
    },

    // The data to register the command
    json: {
        name: 'choose',
        description: 'Get a random choice from a list',
        options: [
            {
                name: 'choices',
                description: 'The list of choices to choose from',
                type: 3,
                required: true
            }
        ]
    }
};
