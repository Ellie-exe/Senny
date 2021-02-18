const { MessageEmbed } = require('discord.js');
const { exec } = require('child_process');
/**
 * @param {import('../../types').Message} message
 * @param {import('../../types').args} args
 * @param {import('../../types').Utils} utils
 */
module.exports.execute = async (message, args, utils) => {
    try {
        if(!process.env.admins.includes(message.author.id)) throw new Error('Missing Permissions');
        const option = args.shift().toLowerCase();

        switch (option) {
            case 'stage': {
                if (args[0] === 'all') args.splice(0, 1, '.');

                exec(`git add ${args.join(' ')}`, (err, stdout, stderr) => {
                    if (err) {
                        const embed = new MessageEmbed()
                            .setTitle('Error')
                            .setDescription(`\`\`\`\n${err}\n\`\`\``)
                            .setColor(process.env.color);

                        message.channel.send(embed).catch(err => utils.logger.error(err));
                        utils.logger.error(err);

                    } else {
                        exec('git status', (err, stdout, stderr) => {
                            if (err) {
                                const embed = new MessageEmbed()
                                    .setTitle('Error')
                                    .setDescription(`\`\`\`\n${err}\n\`\`\``)
                                    .setColor(process.env.color);

                                message.channel.send(embed).catch(err => utils.logger.error(err));
                                utils.logger.error(err);

                            } else {
                                const embed = new MessageEmbed()
                                    .setTitle('Changes Staged')
                                    .setDescription(`\`\`\`\n${stdout}\n${stderr}\n\`\`\``)
                                    .setColor(process.env.color);

                                message.channel.send(embed).catch(err => {utils.logger.error(err)});
                            }
                        });
                    }
                });

                break;
            }

            case 'commit': {
                exec(`git commit -m '${args.join(' ')}'`, (err, stdout, stderr) => {
                    if (err) {
                        const embed = new MessageEmbed()
                            .setTitle('Error')
                            .setDescription(`\`\`\`\n${err}\n\`\`\``)
                            .setColor(process.env.color);

                        message.channel.send(embed).catch(err => utils.logger.error(err));
                        utils.logger.error(err);

                    } else {
                        const embed = new MessageEmbed()
                            .setTitle('Git Committed')
                            .setDescription(`\`\`\`\n${stdout}\n${stderr}\n\`\`\``)
                            .setColor(process.env.color);

                        message.channel.send(embed).catch(err => {utils.logger.error(err)});
                    }
                });

                break;
            }

            case 'push': {
                exec('git push origin master', (err, stdout, stderr) => {
                    if (err) {
                        const embed = new MessageEmbed()
                            .setTitle('Error')
                            .setDescription(`\`\`\`\n${err}\n\`\`\``)
                            .setColor(process.env.color);

                        message.channel.send(embed).catch(err => utils.logger.error(err));
                        utils.logger.error(err);

                    } else {
                        const embed = new MessageEmbed()
                            .setTitle('Git Pushed')
                            .setDescription(`\`\`\`\n${stdout}\n${stderr}\n\`\`\``)
                            .setColor(process.env.color);

                        message.channel.send(embed).catch(err => {utils.logger.error(err)});
                    }
                });

                break;
            }

            case 'pull': {
                exec('git pull origin master', (err, stdout, stderr) => {
                    if (err) {
                        const embed = new MessageEmbed()
                            .setTitle('Error')
                            .setDescription(`\`\`\`\n${err}\n\`\`\``)
                            .setColor(process.env.color);

                        message.channel.send(embed).catch(err => utils.logger.error(err));
                        utils.logger.error(err);

                    } else {
                        const embed = new MessageEmbed()
                            .setTitle('Git Pulled')
                            .setDescription(`\`\`\`\n${stdout}\n${stderr}\n\`\`\``)
                            .setColor(process.env.color);

                        message.channel.send(embed).catch(err => {utils.logger.error(err)});
                    }
                });

                break;
            }

            default: {
                throw new Error('Command not found');
            }
        }

    } catch (err) {
        message.channel.send(`${utils.constants.emojis.redX} ${err.name}: \`${err.message}\``).catch(err => utils.logger.error(err));
        utils.logger.error(err);
    }
};
