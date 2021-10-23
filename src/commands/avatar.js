module.exports = {
    data: new SlashCommand()
        .setName('avatar')
        .setDescription('Get a user\'s avatar')
        .addUserOption(option => option
            .setName('user')
            .setDescription('The user to get an avatar from')
        ),

    /** @param {import('discord.js/typings').CommandInteraction} command */
    async execute(command) {
        try {
            const user = command.options.getUser('user') || command.user;
            const avatar = user.displayAvatarURL({format: 'png', dynamic: true, size: 4096});

            await command.reply(avatar);

        } catch (err) {
            logger.error(err);
        }
    }
};
