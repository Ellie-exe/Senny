module.exports = {
    /** @param {import('discord.js/typings').CommandInteraction} command */
    async execute(command) {
        try {
            await command.reply('Restarting...');
            process.exit(0);

        } catch (err) {
            logger.error(err);
        }
    },

    data: [
        {
            type: 'CHAT_INPUT',
            name: 'restart',
            description: 'Restarts the bot',
            defaultPermission: false
        }
    ],

    flags: {
        developer: true,
        guild: false
    }
};
