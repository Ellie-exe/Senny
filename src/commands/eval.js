const { SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js');
const { logger } = require('../utils');

module.exports = {
    guild: null,
    data: new SlashCommandBuilder()
        .setName('eval')
        .setDescription('Evaluate JavaScript code')
        .setIntegrationTypes([0, 1])
        .setContexts([0, 1, 2])
        .addStringOption(option =>
            option.setName('code')
                .setDescription('The code to evaluate')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('depth')
                .setDescription('The depth to inspect to')
                .setRequired(false)),

    /** @param {ChatInputCommandInteraction} interaction */
    async execute(interaction) {
        try {
            if (interaction.user.id !== '468854398806654976') {
                await interaction.reply('You do not have permission to use this command.');
                return;
            }

            await interaction.deferReply();
            const depth = interaction.options.getInteger('depth') || 0;

            let code = interaction.options.getString('code');
            if (code.includes('await')) code = `(async () => {${code}})();`;

            const output = await eval(code);
            if (output instanceof Promise) await output;

            let result = output;
            if (typeof output === 'function') result = output.toString();
            if (typeof output !== 'string') result = require('util').inspect(output, { depth: depth });

            const paginate = (string) => {
                const lines = string.split('\n');
                let out = '```ansi\n';
                const pages = [];

                for (const line of lines) {
                    if (out.length + line.length < 1997) {
                        out += line + '\n';
                        continue;
                    }

                    pages.push(out + '```');
                    out = '```ansi\n' + line + '\n';
                }

                if (out.length > 9) {
                    pages.push(out + '```');
                }

                return pages;
            }

            const pages = paginate(result);
            await interaction.editReply(pages.shift());

            for (const page of pages) {
                await interaction.channel.send(page);
            }

        } catch (err) {
            await interaction.editReply(`\`\`\`ansi\n${err.stack}\n\`\`\``);
            logger.error(err.stack);
        }
    }
};
