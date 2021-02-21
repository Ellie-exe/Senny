/**
 * @param {import('../../types').Interaction} interaction
 * @param {import('../../types').Utils} utils
 * @param {import('../../types').Cache} cache
 */
module.exports = async (interaction, commands, utils, cache) => {
    try {
        const command = interaction.data;
        const channelID = interaction.channelID;
        const username = interaction.user.username;
        const discriminator = interaction.user.discriminator;

        if (command.options && !command.options[0].value) {
            utils.logger.info(`${channelID} ${username}#${discriminator}: /${command.name} ${command.options[0].name}`);

        } else {
            utils.logger.info(`${channelID} ${username}#${discriminator}: /${command.name}`);
        }

        if (command.name.match(/^\d/) !== null) {
            commands['_' + command.name].execute(interaction, utils);
            return;
        }

        commands[command.name].execute(interaction, utils, cache);

    } catch (err) {
        interaction.error(err);
    }
}
