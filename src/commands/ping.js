module.exports = {
    /**
     * @param {import('../utils').Interaction} command
     */
    async execute(command) {
        try {
            const start = Date.now();
            await command.send('Pinging...');

            const end = Date.now();
            await command.edit(`Pong! Took **${end - start}**ms`);

        } catch (err) {
            await command.error(err);
        }
    },

    data: {
        name: 'ping',
        description: 'Get the bot\'s latency'
    }
};
