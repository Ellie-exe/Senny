const Enmap = require('enmap');
/**
 * @param {import('../types').Interaction} command
 * @param {import('../types').Utils} utils
 */
module.exports.execute = async (command, utils) => {
    try {
        const guildID = command.guildID;
        const guild = command.client.guilds.cache.get(command.guildID);
        const member = await guild.members.fetch(command.data.options[0].value);
        const author = await guild.members.fetch(command.authorID);
        
        const muteRole = new Enmap({name: 'muteRole'});
        const muteList = new Enmap({name: 'muteList'});

        if (await utils.check(author, guildID, {roles: ['admin', 'mod']}) === false) throw new Error('Missing Permissions');
        if (!muteRole.indexes.includes(guildID)) throw new Error('The mute role has not been set');
        if (!muteList.indexes.includes(member.id)) throw new Error('That user is not muted');

        await member.roles.remove(muteRole.get(guildID));
        command.send(`${member.toString()} has been unmuted`);
        muteList.delete(member.id);

    } catch (err) {
        command.send(`${utils.constants.emojis.redX} Error: \`${err}\``, {typs: 3, flags: 64});
        utils.logger.error(err);
    }
};