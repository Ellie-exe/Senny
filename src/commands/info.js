module.exports = {
    /** @param {import('discord.js/typings').CommandInteraction} command */
    async execute(command) {
        try {
            const user = command.options.getMember('user') || command.member;
            await command.reply(`${user.id}: ${user.user.tag}`);

        } catch (err) {
            logger.error(err);
        }
    },

    data: [
        {
            type: 'CHAT_INPUT',
            name: 'info',
            description: 'Get a user\'s info',
            options: [
                {
                    type: 'USER',
                    name: 'user',
                    description: 'The user to get info on'
                }
            ]
        },
        {
            type: 'USER',
            name: 'info'
        }
    ]
};
