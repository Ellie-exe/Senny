const { MessageEmbed } = require('discord.js');

module.exports = {
    /**
     * Send a member's avatar
     * @param {import('../utils').Interaction} command
     */
    async execute(command) {
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
    },

    // The data to register the command
    json: {
        name: 'avatar',
        description: 'Get a user\'s avatar',
        options: [
            {
                name: 'user',
                description: 'The user to get an avatar from',
                type: 6
            }
        ]
    }
};
