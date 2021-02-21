/**
 * @param {import('../../types').Interaction} command
 */
module.exports.execute = async (command) => {
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

        if (command.data.options[0].value.match(/[a-z]/gi) === null) throw new Error('Please ask an actual question');

        command.send(responses[Math.floor(Math.random() * responses.length)]);

    } catch (err) {
        command.error(err);
    }
};