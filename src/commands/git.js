module.exports = {
    /** @param {import('discord.js/typings').CommandInteraction} command */
    async execute(command) {
        try {
            const { exec } = require('child_process');

            switch (command.options.getSubcommand()) {
                case 'status': {
                    exec('git status', async (err, stdout, stderr) => {
                        if (err) return await command.reply(`\`\`\`ps\n${err}\n\`\`\``);

                        await command.reply(`\`\`\`ps\n${stdout}\n${stderr}\n\`\`\``);
                    });

                    break;
                }

                case 'add': {
                    const file = command.options.getString('file');

                    exec(`git add ${file}`, async (err) => {
                        if (err) return await command.reply(`\`\`\`ps\n${err}\n\`\`\``);

                        exec('git status', async (err, stdout, stderr) => {
                            if (err) return await command.reply(`\`\`\`ps\n${err}\n\`\`\``);

                            await command.reply(`\`\`\`ps\n${stdout}\n${stderr}\n\`\`\``);
                        });

                    });

                    break;
                }

                case 'restore': {
                    const file = command.options.getString('file');

                    exec(`git restore --staged ${file}`, async (err) => {
                        if (err) return await command.reply(`\`\`\`ps\n${err}\n\`\`\``);

                        exec('git status', async (err, stdout, stderr) => {
                            if (err) return await command.reply(`\`\`\`ps\n${err}\n\`\`\``);

                            await command.reply(`\`\`\`ps\n${stdout}\n${stderr}\n\`\`\``);
                        });
                    });

                    break;
                }

                case 'commit': {
                    const message = command.options.getString('message');

                    exec(`git commit -m "${message}"`, async (err, stdout, stderr) => {
                        if (err) return await command.reply(`\`\`\`ps\n${err}\n\`\`\``);

                        await command.reply(`\`\`\`ps\n${stdout}\n${stderr}\n\`\`\``);
                    });

                    break;
                }

                case 'checkout': {
                    const branch = command.options.getString('branch');

                    exec(`git checkout ${branch}`, async (err, stdout, stderr) => {
                        if (err) return await command.reply(`\`\`\`ps\n${err}\n\`\`\``);

                        await command.reply(`\`\`\`ps\n${stdout}\n${stderr}\n\`\`\``);
                    });

                    break;
                }

                case 'push': {
                    exec('git push', async (err, stdout, stderr) => {
                        if (err) return await command.reply(`\`\`\`ps\n${err}\n\`\`\``);

                        await command.reply(`\`\`\`ps\n${stdout}\n${stderr}\n\`\`\``);
                    });

                    break;
                }

                case 'pull': {
                    exec('git pull', async (err, stdout, stderr) => {
                        if (err) return await command.reply(`\`\`\`ps\n${err}\n\`\`\``);

                        await command.reply(`\`\`\`ps\n${stdout}\n${stderr}\n\`\`\``);
                    });

                    break;
                }
            }

        } catch (err) {
            logger.error(err);
        }
    },

    data: [
        {
            type: 'CHAT_INPUT',
            name: 'git',
            description: 'Runs a git command',
            defaultPermission: false,
            options: [
                {
                    type: 'SUB_COMMAND',
                    name: 'status',
                    description: 'Get the status of the repository'
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'add',
                    description: 'Add a file to the staging area',
                    options: [
                        {
                            type: 'STRING',
                            name: 'file',
                            description: 'The file to add',
                            required: true
                        }
                    ]
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'restore',
                    description: 'Restore a file from the stash',
                    options: [
                        {
                            type: 'STRING',
                            name: 'file',
                            description: 'The file to add',
                            required: true
                        }
                    ]
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'commit',
                    description: 'Commit changes to the repository',
                    options: [
                        {
                            type: 'STRING',
                            name: 'message',
                            description: 'The commit message',
                            required: true
                        }
                    ]
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'checkout',
                    description: 'Checkout a branch',
                    options: [
                        {
                            type: 'STRING',
                            name: 'branch',
                            description: 'The branch to checkout',
                            required: true
                        }
                    ]
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'pull',
                    description: 'Pull the latest changes from the remote repository'
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'push',
                    description: 'Push the local changes to the remote repository'
                },
            ]
        }
    ],

    flags: {
        developer: true,
        guild: false
    }
};
