const { exec } = require('child_process');

module.exports = {
    /**
     * @param {import('discord.js').Message} message
     * @param {string[]} args
     * @param {import('../utils')} utils
     */
    async execute(message, args, utils) {
        try {
            if(!process.env.admins.includes(message.author.id)) throw new Error('Missing Permissions');
            const option = args.shift().toLowerCase();

            switch (option) {
                case 'status': {
                    exec('git status', async (err, stdout, stderr) => {
                        if (err) {
                            const embed = new utils.MessageEmbed()
                                .setTitle('Error')
                                .setDescription(`\`\`\`\n${err}\n\`\`\``)
                                .setColor(process.env.color);

                            await message.channel.send(embed).catch(err => utils.logger.error(err));
                            utils.logger.error(err);
                            return;
                        }

                        const embed = new utils.MessageEmbed()
                            .setTitle('Git Status')
                            .setDescription(`\`\`\`\n${stdout}\n${stderr}\n\`\`\``)
                            .setColor(process.env.color);

                        await message.channel.send(embed).catch(err => {utils.logger.error(err)});
                    });

                    break;
                }

                case 'stage': {
                    if (args[0] === 'all') args.splice(0, 1, '.');

                    exec(`git add ${args.join(' ')}`, async (err) => {
                        if (err) {
                            const embed = new utils.MessageEmbed()
                                .setTitle('Error')
                                .setDescription(`\`\`\`\n${err}\n\`\`\``)
                                .setColor(process.env.color);

                            await message.channel.send(embed).catch(err => utils.logger.error(err));
                            utils.logger.error(err);
                            return;
                        }
                        
                        exec('git status', async (err, stdout, stderr) => {
                            if (err) {
                                const embed = new utils.MessageEmbed()
                                    .setTitle('Error')
                                    .setDescription(`\`\`\`\n${err}\n\`\`\``)
                                    .setColor(process.env.color);

                                await message.channel.send(embed).catch(err => utils.logger.error(err));
                                utils.logger.error(err);
                                return;
                            }

                            const embed = new utils.MessageEmbed()
                                .setTitle('Changes Staged')
                                .setDescription(`\`\`\`\n${stdout}\n${stderr}\n\`\`\``)
                                .setColor(process.env.color);

                            await message.channel.send(embed).catch(err => {utils.logger.error(err)});
                        });
                        
                    });

                    break;
                }

                case 'unstage': {
                    if (args[0] === 'all') args.splice(0, 1, '.');

                    exec(`git restore --staged ${args.join(' ')}`, async (err) => {
                        if (err) {
                            const embed = new utils.MessageEmbed()
                                .setTitle('Error')
                                .setDescription(`\`\`\`\n${err}\n\`\`\``)
                                .setColor(process.env.color);

                            await message.channel.send(embed).catch(err => utils.logger.error(err));
                            utils.logger.error(err);
                            return;
                        }

                        exec('git status', async (err, stdout, stderr) => {
                            if (err) {
                                const embed = new utils.MessageEmbed()
                                    .setTitle('Error')
                                    .setDescription(`\`\`\`\n${err}\n\`\`\``)
                                    .setColor(process.env.color);

                                await message.channel.send(embed).catch(err => utils.logger.error(err));
                                utils.logger.error(err);
                                return;
                            }
                            
                            const embed = new utils.MessageEmbed()
                                .setTitle('Changes Unstaged')
                                .setDescription(`\`\`\`\n${stdout}\n${stderr}\n\`\`\``)
                                .setColor(process.env.color);

                            await message.channel.send(embed).catch(err => {utils.logger.error(err)});
                        });
                    });

                    break;
                }

                case 'commit': {
                    exec(`git commit -m "${args.join(' ')}"`, async (err, stdout, stderr) => {
                        if (err) {
                            const embed = new utils.MessageEmbed()
                                .setTitle('Error')
                                .setDescription(`\`\`\`\n${err}\n\`\`\``)
                                .setColor(process.env.color);

                            await message.channel.send(embed).catch(err => utils.logger.error(err));
                            utils.logger.error(err);
                            return;
                        }

                        const embed = new utils.MessageEmbed()
                            .setTitle('Git Committed')
                            .setDescription(`\`\`\`\n${stdout}\n${stderr}\n\`\`\``)
                            .setColor(process.env.color);
                        
                        await message.channel.send(embed).catch(err => {utils.logger.error(err)});
                    });

                    break;
                }

                case 'push': {
                    exec('git push origin master', async (err, stdout, stderr) => {
                        if (err) {
                            const embed = new utils.MessageEmbed()
                                .setTitle('Error')
                                .setDescription(`\`\`\`\n${err}\n\`\`\``)
                                .setColor(process.env.color);

                            await message.channel.send(embed).catch(err => utils.logger.error(err));
                            utils.logger.error(err);
                            return;
                        }

                        const embed = new utils.MessageEmbed()
                            .setTitle('Git Pushed')
                            .setDescription(`\`\`\`\n${stdout}\n${stderr}\n\`\`\``)
                            .setColor(process.env.color);

                        await message.channel.send(embed).catch(err => {utils.logger.error(err)});
                    });

                    break;
                }

                case 'pull': {
                    exec('git pull origin master', async (err, stdout, stderr) => {
                        if (err) {
                            const embed = new utils.MessageEmbed()
                                .setTitle('Error')
                                .setDescription(`\`\`\`\n${err}\n\`\`\``)
                                .setColor(process.env.color);

                            await message.channel.send(embed).catch(err => utils.logger.error(err));
                            utils.logger.error(err);
                            return;
                        }
                        
                        const embed = new utils.MessageEmbed()
                            .setTitle('Git Pulled')
                            .setDescription(`\`\`\`\n${stdout}\n${stderr}\n\`\`\``)
                            .setColor(process.env.color);

                        await message.channel.send(embed).catch(err => {utils.logger.error(err)});
                    });

                    break;
                }
            }

        } catch (err) {
            await message.channel.send(err, {code: 'xl', split: true}).catch(err => utils.logger.error(err));
            utils.logger.error(err);
        }
    }
};
