module.exports = {
    /**
     * @param {import('../utils').Interaction} command
     * @param {import('../utils')} utils
     */
    async execute(command, utils) {
        try {
            const userID = command.data.options ? command.data.options[0].value : command.authorID;
            const user = await command.client.users.fetch(userID);
            const avatarURL = user.displayAvatarURL({dynamic: true, size: 4096});

            const embed = new utils.MessageEmbed()
                .setAuthor(`${user.tag} - Avatar`, null, avatarURL)
                .setImage(avatarURL)
                .setColor(process.env.color);

            await command.embed([embed]);

        } catch (err) {
            await command.error(err);
        }
    },

    data: {
        name: 'avatar',
        description: 'Get a user\'s avatar',
        options: [
            {
                name: 'user',
                description: 'User to get',
                type: 6
            }
        ]
    }
};
