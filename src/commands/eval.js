module.exports = {
    /** @param {import('discord.js/typings').CommandInteraction} command */
    async execute(command) {
        try {
            let code = command.options.getString('code');
            if (code.includes('await')) code = `(async () => {${code}})();`;

            const output = await eval(code);
            if (output instanceof Promise) await output;

            let result = output;
            if (typeof output === 'function') result = output.toString();
            if (typeof output !== 'string') result = require('util').inspect(output, {depth: 0});

            await command.reply(`\`\`\`ps\n${result}\n\`\`\``);

        } catch (err) {
            await command.reply(`\`\`\`ps\n${err}\n\`\`\``);
            logger.error(err);
        }
    },

    data: [
        {
            type: 'CHAT_INPUT',
            name: 'eval',
            description: 'Evaluates a JavaScript expression',
            defaultPermission: false,
            options: [
                {
                    type: 'STRING',
                    name: 'code',
                    description: 'The code to evaluate',
                    required: true
                }
            ]
        }
    ],

    flags: {
        developer: true
    }
};
