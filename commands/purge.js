/**
 * @param {import('../types').Interaction} command
 * @param {import('../types').Utils} utils
 */
module.exports.execute = async (command, utils) => {
    try {
        const guildID = command.guildID;
        const guild = command.client.guilds.cache.get(guildID);
        const channel = guild.channels.cache.get(command.channelID);
        const author = await guild.members.fetch(command.authorID);
        const amount = command.data.options[0].value;

        if (!author.hasPermission('MANAGE_MESSAGES') && await utils.isStaff(author, guildID) === false) {
            throw new Error('Missing Permissions');
        }

        await channel.bulkDelete(amount);
        command.send(`${amount} messages have been deleted`, {type: 3, flags: 64});

    } catch (err) {
        command.send(`${utils.constants.emojis.redX} Error: \`${err}\``, {type: 3, flags: 64});
        utils.logger.error(err);
    }
};