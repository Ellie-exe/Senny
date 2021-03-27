/**
 * Fires every time the bot recieves an interaction
 * @param {import('../utils').Interaction} interaction
 * @param {import('../utils')} utils
 * @param {import('redis').RedisClient} cache
 */
module.exports = async (interaction, commands, utils, cache) => {
    try {
        const command = interaction.data;
        const channelID = interaction.channelID;
        const user = await interaction.client.users.fetch(interaction.userID);

        let log = `${command.name}`;

        if (command.options?.values().next().value.type === 1) log += ` ${command.options[0].name}`;
        utils.logger.info(`${channelID} ${user.tag}: /${log}`);

        if (command.name.match(/^\d/) !== null) {
            commands['_' + command.name].execute(interaction, utils);
            return;
        }

        commands[command.name].execute(interaction, utils, cache);

    } catch (err) {
        interaction.error(err);
    }
};
