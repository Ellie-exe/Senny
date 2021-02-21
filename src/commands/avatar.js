const { MessageEmbed } = require('discord.js');
/**
 * @param {import('../../types').Interaction} command
 */
module.exports.execute = async (command) => {
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
        command.error(err);
    }
};