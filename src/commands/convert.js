module.exports = {
    /** @param {import('discord.js/typings').CommandInteraction} command */
    async execute(command) {
        try {
            const value = command.options.getNumber('value');
            const unit = command.options.getString('unit');
            const newUnit = command.options.getString('convert');

            let newValue;

            switch (unit + newUnit) {
                case '°F°C':
                    newValue = `${Math.round((value - 32) * 5 / 9)}°C`;
                    break;

                case '°C°F':
                    newValue = `${Math.round((value * 9 / 5) + 32)}°F`;
                    break;

                case ' inft':
                    newValue = `${Math.floor(value / 12)} ft${(value % 12) === 0 ? '' : ` ${value % 12} in`}`;
                    break;

                case ' ftin':
                    newValue = `${Math.round(value * 12)} in`;
                    break;

                case ' incm':
                    newValue = `${Math.round(value * 2.54)} cm`;
                    break;

                case ' cmin':
                    newValue = `${Math.round(value / 2.54)} in`;
                    break;

                default:
                    await command.reply('Invalid unit or conversion');
                    return Promise.reject(Error('Invalid unit or conversion'));
            }

            await command.reply(`**Input:** \`${value}${unit}\`\n**Output:** \`${newValue}\``);

        } catch (err) {
            logger.error(err);
        }
    },

    data: [
        {
            type: 'CHAT_INPUT',
            name: 'convert',
            description: 'Convert a value to another unit',
            options: [
                {
                    type: 'NUMBER',
                    name: 'value',
                    description: 'The numeric value to convert',
                    required: true
                },
                {
                    type: 'STRING',
                    name: 'unit',
                    description: 'The current unit',
                    required: true,
                    choices: [
                        {
                            name: 'fahrenheit',
                            value: '°F'
                        },
                        {
                            name: 'celsius',
                            value: '°C'
                        },
                        {
                            name: 'inches',
                            value: ' in'
                        },
                        {
                            name: 'feet',
                            value: ' ft'
                        },
                        {
                            name: 'centimeters',
                            value: ' cm'
                        }
                    ]
                },
                {
                    type: 'STRING',
                    name: 'convert',
                    description: 'The unit to convert to',
                    required: true,
                    choices: [
                        {
                            name: 'fahrenheit',
                            value: '°F'
                        },
                        {
                            name: 'celsius',
                            value: '°C'
                        },
                        {
                            name: 'inches',
                            value: 'in'
                        },
                        {
                            name: 'feet',
                            value: 'ft'
                        },
                        {
                            name: 'centimeters',
                            value: 'cm'
                        }
                    ]
                }
            ]
        }
    ]
};
