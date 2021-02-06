/**
 * @param {import('../types').Interaction} command
 * @param {import('../types').Utils} utils
 */
module.exports.execute = async (command, utils) => {
    try {
        const options = command.data.options;
        const guildID = command.guildID;
        const guild = command.client.guilds.cache.get(guildID);
        const member = await guild.members.fetch(command.data.options[0].value);
        const author = await guild.members.fetch(command.authorID);

        let reason = undefined;
        let silent = undefined;

        if (!author.hasPermission('KICK_MEMBERS') && !utils.isAdmin(author, guildID) && !utils.isMod(author, guildID)) {
            throw new Error('Missing Permissions');
        }

        for (const option in options) {
            switch (options[option].name) {
                case 'reason':
                    reason = options[option].value;
                    break;

                case 'silent':
                    silent = {type: 3, flags: 64};
                    break;
            }
        }

        await member.kick(reason);
        
        command.send(`${member.toString()} ${member.user.tag} has been kicked for reason: \`${reason || 'None'}\``, silent);
    
    } catch (err) {
        command.send(`${utils.constants.emojis.redX} Error: \`${err}\``, {type: 3, flags: 64});
        utils.logger.error(err);
    }
};