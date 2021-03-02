const { MessageEmbed } = require('discord.js');
/**
 * Send a member's avatar
 * @param {import('../../types').Interaction} command
 */
module.exports.execute = async (command) => {
    try {
        const guildID = command.guildID; // The current guild
        
        // Get the member, if no member is provided then get the command author
        const memberID = command.data.options ? command.data.options[0].value : command.authorID;
        const member = await command.client.guilds.cache.get(guildID).members.fetch(memberID);

        // Get the avatar's URL
        const avatarURL = member.user.displayAvatarURL({format: 'png', dynamic: true, size: 4096});

        // Create an embed
        const embed = new MessageEmbed()
            .setAuthor(`${member.user.tag} - Avatar`, null, avatarURL)
            .setImage(avatarURL)
            .setColor(process.env.color);

        // Send the embed
        command.embed([embed]);

    } catch (err) {
        // Log any errors
        command.error(err);
    }
};
