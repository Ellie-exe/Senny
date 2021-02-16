const { MessageEmbed } = require('discord.js');
/**
 * @param {import('../../types').Interaction} command
 * @param {import('../../types').Utils} utils
 */
module.exports.execute = async (command, utils) => {
    try {
        const guildID = command.guildID;
        const userID = command.data.options ? command.data.options[0].value : command.userID;
        const member = await command.client.guilds.cache.get(guildID).members.fetch(userID);
        const avatarURL = member.user.displayAvatarURL({format: 'png', dynamic: true, size: 4096});

        const embed = new MessageEmbed()
            .setAuthor(`${member.user.tag} - Avatar`, null, avatarURL)
            .setImage(avatarURL)
            .setColor(process.env.color);

        command.embed([embed]);

    } catch (err) {
        command.send(`${utils.constants.emojis.redX} ${err.name}: \`${err.message}\``, {type: 3, flags: 64});
        utils.logger.error(err);
    }
};