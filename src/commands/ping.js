/**
 * @param {import('../../types').Interaction} command
 */
module.exports.execute = async (command) => {
    try {
        const start = Date.now();
        await command.send('Pinging...');

        const end = Date.now();
        command.edit(`Pong! Took **${end - start}**ms`);

    } catch (err) {
        command.error(err);
    }
};