module.exports = {
    /**
     * @param {import('../utils').Interaction} command
     */
    async execute(command) {
        try {
            const options = command.data.options[0].value;
            const choices = options.split(options.includes(',') ? /\s*,\s*/ : / +/);

            const choice = choices[Math.floor(Math.random() * choices.length)];

            await command.send(`**Options:** ${choices.join(', ')}\n**Choice:** ${choice}`);

        } catch (err) {
            await command.error(err);
        }
    },

    data: {
        name: 'choose',
        description: 'Picks a random choice',
        options: [
            {
                name: 'choices',
                description: 'List of choices',
                required: true,
                type: 3
            }
        ]
    }
};
