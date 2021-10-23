module.exports = {
    /**
     * @param {import('../utils').Interaction} command
     */
    async execute(command) {
        try {
            const value = command.data.options[0].value;
            const unit = command.data.options[0].name;

            let conversion;
            let original;

            switch (unit) {
                case 'fahrenheit':
                    conversion = `${Math.round((value - 32) * 5 / 9)}°C`;
                    original = `${value}°F`;
                    break;

                case 'celsius':
                    conversion = `${Math.round((value * 9/5) + 32)}°F`;
                    original = `${value}°C`;
                    break;

                case 'inches':
                    conversion = `${Math.round(value * 2.54)} cm`;
                    original = `${value} in`;
                    break;

                case 'centimeters':
                    conversion = `${Math.round(value / 2.54)} in`;
                    original = `${value} cm`;
                    break;
            }

            await command.send(`**Input:** \`${original}\`\n**Output:** \`${conversion}\``);

        } catch (err) {
            await command.error(err);
        }
    },

    data: {
        name: 'convert',
        description: 'Convert between units',
        options: [
            {
                name: 'fahrenheit',
                description: 'Value to convert',
                type: 4
            },
            {
                name: 'celsius',
                description: 'Value to convert',
                type: 4
            },
            {
                name: 'inches',
                description: 'Value to convert',
                type: 4
            },
            {
                name: 'centimeters',
                description: 'Value to convert',
                type: 4
            }
        ]
    }
};
