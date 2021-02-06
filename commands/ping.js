/**
 * @param {import('../types').Interaction} command
 * @param {import('../types').Utils} utils
 */
module.exports.execute = async (command, utils) => {
    try {
        const start = Date.now();
        await command.send('Pinging...');

        const end = Date.now();
        setTimeout(async () => {
            command.edit(`Pong! Took **${end - start}**ms`);
                    
        }, 500);

    } catch (err) {
        command.send(`${utils.constants.emojis.redX} Error: \`${err}\``, {type: 3, flags: 64});
        utils.logger.error(err);
    }
};