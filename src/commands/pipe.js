const { SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js');
const { exec } = require('child_process');
const { logger } = require('../utils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pipe')
        .setDescription('Pipes a command to the host terminal')
        .addStringOption(option =>
            option.setName('command')
                .setDescription('The command to pipe')
                .setRequired(true)),

    /** @param {ChatInputCommandInteraction} interaction */
    async execute(interaction) {
        try {
            if (interaction.user.id !== '468854398806654976') {
                await interaction.reply('You do not have permission to use this command.');
                return;
            }

            const command = interaction.options.getString('command');
            await interaction.deferReply();

            exec(`echo "${command}" > pipe && cat pipe`, async (err, stdout, stderr) => {
                try {
                    if (err) {
                        await interaction.editReply(`\`\`\`ansi\n${err}\n\`\`\``);
                        return;
                    }

                    await interaction.editReply(`\`\`\`ansi\n${stdout}\n${stderr}\n\`\`\``);

                } catch (err) {
                    await interaction.editReply(`\`\`\`ansi\n${err.stack}\n\`\`\``);
                    logger.error(err.stack);
                }
            });

        } catch (err) {
            await interaction.editReply(`\`\`\`ansi\n${err.stack}\n\`\`\``);
            logger.error(err.stack);
        }
    }
};
