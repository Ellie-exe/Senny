module.exports = {
    data: new SlashCommand()
        .setName('user')
        .setDescription('Get a user\'s info')
        .addUserOption(option => option
            .setName('user')
            .setDescription('The user to get info on')
        ),

    /** @param {import('discord.js/typings').CommandInteraction} command */
    async execute(command) {
        try {
            const user = command.options.getMember('name') || command.member;

        } catch (err) {
            logger.error(err);
        }
    }
};
