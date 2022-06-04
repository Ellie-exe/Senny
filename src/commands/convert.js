module.exports = {
    /** @param {import('discord.js/typings').CommandInteraction} command */
    async execute(command) {
        try {
            const value = command.options.getNumber('value');
            const unit = command.options.getString('unit');
            const newUnit = command.options.getString('convert');

            const cmtoft = ((value / 2.54) % 12) === 0 ? '' : ` ${Math.round((value / 2.54) % 12)} in`;
            const intoft = (value % 12) === 0 ? '' : ` ${value % 12} in`;

            const conversions = {
                FC: `**${value}°F** is **${Math.round((value - 32) * 5 / 9)}°C**`,
                CF: `**${value}°C** is **${Math.round((value * 9 / 5) + 32)}°F**`,
                incm: `**${value} in** is **${Math.round(value * 2.54)} cm**`,
                inft: `**${value} in** is **${Math.floor(value / 12)} ft${intoft}**`,
                ftin: `**${value} ft** is **${Math.round(value * 12)} in**`,
                cmin: `**${value} cm** is **${Math.round(value / 2.54)} in**`,
                cmft: `**${value} cm** is **${Math.floor((value / 2.54) / 12)} ft${cmtoft}**`
            };

            await command.reply(conversions[unit + newUnit] || 'Invalid conversion');

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
                            value: 'F'
                        },
                        {
                            name: 'celsius',
                            value: 'C'
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
                },
                {
                    type: 'STRING',
                    name: 'convert',
                    description: 'The unit to convert to',
                    required: true,
                    choices: [
                        {
                            name: 'fahrenheit',
                            value: 'F'
                        },
                        {
                            name: 'celsius',
                            value: 'C'
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
    ],

    flags: {
        developer: false,
        guild: false
    }
};
