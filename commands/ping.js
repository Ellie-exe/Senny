module.exports = {
    name: 'ping',
    async execute(command) {
        const start = Date.now();
        await command.send('Pinging...');

        const end = Date.now();
        setTimeout(function () {
            command.edit(`Pong! Took **${end - start}**ms`);
                
        }, 1000);
    }
};