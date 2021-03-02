/**
 * Fires every time the bot recieves an interaction
 * @param {import('../../types').Interaction} interaction
 * @param {import('../../types').Utils} utils
 * @param {import('redis').RedisClient} cache
 */
module.exports = async (interaction, commands, utils, cache) => {
    try {
        const command = interaction.data; // The raw interaction data
        const channelID = interaction.channelID; // The channel the command was run in
        const user = await interaction.client.users.fetch(interaction.userID); // Fetch the author of the command

        let log = `${command.name}`; // The name of the command that was used

        // If the command has a subcommand, add it to the log, then log the command
        if (command.options?.values().next().value.type === 1) log += ` ${command.options[0].name}`;
        utils.logger.info(`${channelID} ${user.tag}: /${log}`);

        // If the command begins with a number, add an underscore in the front
        // This is because command names cannot start with a number
        if (command.name.match(/^\d/) !== null) {
            commands['_' + command.name].execute(interaction, utils);
            return;
        }

        // Execute the command
        commands[command.name].execute(interaction, utils, cache);

    } catch (err) {
        // Log the error with the interaction error method, this sends the error as an ephemeral message
        interaction.error(err);
    }
};
