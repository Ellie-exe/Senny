const { SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js');
const { exec } = require('child_process');
const { logger } = require('../utils');

module.exports = {
    guild: null,
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
            const channel = interaction.channel;
            await interaction.deferReply();

            exec(`echo "${command}" > pipe && cat pipe`, async (err, stdout, stderr) => {
                try {
                    if (err) {
                        logger.error(err.stack);
                        return;
                    }

                    const paginate = (string, messages) => {
                        const lines = string.split('\n');
                        let out = '```ansi\n';

                        for (const line of lines) {
                            if (out.length + line.length < 1997) {
                                out += line + '\n';
                                continue;
                            }

                            messages.push(out + '```');
                            out = '```ansi\n' + line + '\n';
                        }

                        if (out.length > 9) {
                            messages.push(out + '```');
                        }

                        return messages;
                    }

                    const messages = [];

                    paginate(stdout, messages);
                    paginate(stderr, messages);

                    await interaction.editReply(messages.shift());

                    for (const message of messages) {
                        await channel.send(message);
                    }

                } catch (err) {
                    await interaction.editReply(`\`\`\`ansi\n${err.stack}\`\`\``);
                    logger.error(err.stack);
                }
            });

        } catch (err) {
            await interaction.editReply(`\`\`\`ansi\n${err.stack}\`\`\``);
            logger.error(err.stack);
        }
    }
};
