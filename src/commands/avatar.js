module.exports = {
    /** @param {import('discord.js/typings').CommandInteraction} command */
    async execute(command) {
        try {
            const user = command.options.getUser('user') || command.user;
            const avatar = user.displayAvatarURL({format: 'png', dynamic: true, size: 4096});

            // TODO: Add support for banners

            await command.reply(avatar);

        } catch (err) {
            logger.error(err);
        }
    },

    data: [
        {
            type: 'CHAT_INPUT',
            name: 'avatar',
            description: 'Get a user\'s avatar',
            options: [
                {
                    type: 'USER',
                    name: 'user',
                    description: 'The user to get an avatar from'
                }
            ]
        },
        {
            type: 'USER',
            name: 'avatar'
        }
    ],

    flags: {
        developer: false
    }
};
