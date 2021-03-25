module.exports = {
    /**
     * Sends a random classic 8ball response to a question
     * @param {import('../utils').Interaction} command
     */
    async execute(command) {
        try {
            // List of classic 8ball responses
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

            // Check the question for words, can't ask a question without words
            if (command.data.options[0].value.match(/[a-z]/gi) === null) throw new Error('Please ask an actual question');
            
            const question = command.data.options[0].value;
            const response = responses[Math.floor(Math.random() * responses.length)]

            // Pick and send a random response
            command.send(`**Question:** ${question}\n**Response:** ${response}`);

        } catch (err) {
            // Log any errors
            command.error(err);
        }
    },

    // The data to register the command
    json: {
        name: '8ball',
        description: 'Ask the Magic 8-ball a question',
        options: [
            {
                name: 'question',
                description: 'Type your question',
                type: 3,
                required: true
            }
        ]
    }
};
