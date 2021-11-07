module.exports = {
    /** @param {import('discord.js/typings').CommandInteraction} command */
    async execute(command) {
        try {
            const responses = [
                'It is certain.',
                'It is decidedly so.',
                'Without a doubt.',
                'Yes - definitely.',
                'You may rely on it.',
                'As I see it, yes.',
                'Most likely.',
                'Outlook good.',
                'Yes.',
                'Signs point to yes.',
                'Reply hazy, try again.',
                'Ask again later.',
                'Better not tell you now.',
                'Cannot predict now.',
                'Concentrate and ask again.',
                'Don\'t count on it.',
                'My reply is no.',
                'My sources say no.',
                'Outlook not so good.',
                'Very doubtful.'
            ];

            const question = command.options.getString('question');
            const response = responses[Math.floor(Math.random() * responses.length)]

            await command.reply(`You asked: **${question}**\nMy response: **${response}**`);

        } catch (err) {
            logger.error(err);
        }
    },

    data: [
        {
            type: 'CHAT_INPUT',
            name: '8ball',
            description: 'Ask the Magic 8-ball a question',
            options: [
                {
                    type: 'STRING',
                    name: 'question',
                    description: 'The question to ask',
                    required: true
                }
            ]
        }
    ]
};
