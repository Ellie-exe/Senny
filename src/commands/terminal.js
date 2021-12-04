module.exports = {
    /** @param {import('discord.js/typings').CommandInteraction} command */
    async execute(command) {
        try {
            const { exec } = require('child_process');

            const cmd = command.options.getString('command');
            await command.deferReply();

            exec(`${cmd}`, async (err, stdout, stderr) => {
                if (err) return await command.reply(`\`\`\`ps\n${err}\n\`\`\``);

                await command.editReply(`\`\`\`ps\n${stdout}\n${stderr}\n\`\`\``);
            });

        } catch (err) {
            logger.error(err);
        }
    },

    data: [
        {
            type: 'CHAT_INPUT',
            name: 'terminal',
            description: 'Executes a command in the terminal',
            defaultPermission: false,
            options: [
                {
                    type: 'STRING',
                    name: 'command',
                    description: 'The command to execute',
                    required: true
                }
            ]
        }
    ],

    flags: {
        developer: true
    }
};
