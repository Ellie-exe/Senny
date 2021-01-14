module.exports = {
    name: 'ping',
    async execute(i) {
        const start = Date.now();
        await i.send('Pinging...');

        const end = Date.now();
        setTimeout(function () {
            i.edit(`Pong! Took **${end - start}**ms`);
                
        }, 1000);
    }
};