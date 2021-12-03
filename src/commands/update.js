module.exports = {
    /** @param {import('discord.js/typings').CommandInteraction} command */
    async execute(command) {
        try {
            const { exec } = require('child_process');

            await command.deferReply();

            exec('npm i', async (err, stdout, stderr) => {
                if (err) return await command.reply(`\`\`\`ps\n${err}\n\`\`\``);

                await command.reply(`\`\`\`ps\n${stdout}\n${stderr}\n\`\`\``);
            });

        } catch (err) {
            logger.error(err);
        }
    },

    data: [
        {
            type: 'CHAT_INPUT',
            name: 'update',
            description: 'Update the bot\'s packages',
            defaultPermission: false
        }
    ],

    flags: {
        developer: true
    }
};
