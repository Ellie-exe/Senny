module.exports = {
    /** @param {import('discord.js/typings').CommandInteraction} command */
    async execute(command) {
        try {
            const { exec } = require('child_process');

            await command.reply('Shutting down...');

            exec('pm2 kill', async (err) => {
                if (err) return await command.reply(`\`\`\`ps\n${err}\n\`\`\``);
            });

        } catch (err) {
            logger.error(err);
        }
    },

    data: [
        {
            type: 'CHAT_INPUT',
            name: 'shutdown',
            description: 'Shuts down the bot',
            defaultPermission: false
        }
    ],

    flags: {
        developer: true
    }
};
