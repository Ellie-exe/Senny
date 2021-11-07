module.exports = {
    /** @param {import('discord.js/typings').CommandInteraction} command */
    async execute(command) {
        try {
            const list = command.options.getString('choices');
            const choices = list.split(list.includes(',') ? /\s*,\s*/ : / +/);
            const choice = choices[Math.floor(Math.random() * choices.length)];

            await command.reply(`Given: **${choices.join(', ')}**\nMy Choice: **${choice}**`);

        } catch (err) {
            logger.error(err);
        }
    },

    data: [
        {
            type: 'CHAT_INPUT',
            name: 'choose',
            description: 'Have something randomly chosen from a list',
            options: [
                {
                    type: 'STRING',
                    name: 'choices',
                    description: 'The list to choose from (either comma or space separated)',
                    required: true
                }
            ]
        }
    ]
};
