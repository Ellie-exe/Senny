module.exports = {
    /**
     * Returns the bot's latency
     * @param {import('../utils').Interaction} command
     */
    async execute(command) {
        try {
            // Get the current timestamp and send the initial message
            const start = Date.now();
            await command.send('Pinging...');

            // Get the new timestamp and edit the message with the difference
            const end = Date.now();
            command.edit(`Pong! Took **${end - start}**ms`);

        } catch (err) {
            // Log any errors
            command.error(err);
        }
    },

    // The data to register the command
    json: {
        name: 'ping',
        description: 'Get the bot\'s latency'
    }
};
