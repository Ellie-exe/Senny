const { MessageEmbed } = require('discord.js');
const { exec } = require('child_process');
/**
 * Dev version control commands
 * @param {import('discord.js').Message} message
 * @param {string[]} args
 * @param {import('../../types').Utils} utils
 */
module.exports.execute = async (message, args, utils) => {
    try {
        // Check if the author is a dev
        if(!process.env.admins.includes(message.author.id)) throw new Error('Missing Permissions');
        const option = args.shift().toLowerCase(); // The subcommand

        // Check which subcommand was used
        switch (option) {
            // Show the status of changes, whether or not they're staged
            case 'status': {
                // Execute the command
                exec('git status', async (err, stdout, stderr) => {
                    // If the command errors
                    if (err) {
                        // Create an embed
                        const embed = new MessageEmbed()
                            .setTitle('Error')
                            .setDescription(`\`\`\`\n${err}\n\`\`\``)
                            .setColor(process.env.color);

                        // Send the embed and log the error
                        await message.channel.send(embed).catch(err => utils.logger.error(err));
                        utils.logger.error(err);
                        return;
                    }

                    // Create an embed
                    const embed = new MessageEmbed()
                        .setTitle('Git Status')
                        .setDescription(`\`\`\`\n${stdout}\n${stderr}\n\`\`\``)
                        .setColor(process.env.color);

                    // Send the embed
                    await message.channel.send(embed).catch(err => {utils.logger.error(err)});
                });

                break;
            }

            // Stage changes
            case 'stage': {
                // Allows 'all' to be a valid arg
                if (args[0] === 'all') args.splice(0, 1, '.');

                // Execute the command
                exec(`git add ${args.join(' ')}`, async (err) => {
                    // If the command errors
                    if (err) {
                        // Create an embed
                        const embed = new MessageEmbed()
                            .setTitle('Error')
                            .setDescription(`\`\`\`\n${err}\n\`\`\``)
                            .setColor(process.env.color);

                        // Send the embed and log the error
                        await message.channel.send(embed).catch(err => utils.logger.error(err));
                        utils.logger.error(err);
                        return;
                    }
                    
                    // Execute a status command for the embed
                    // The add command doesn't have an stdout nor an stderr
                    exec('git status', async (err, stdout, stderr) => {
                        // If the command errors
                        if (err) {
                            // Create an embed
                            const embed = new MessageEmbed()
                                .setTitle('Error')
                                .setDescription(`\`\`\`\n${err}\n\`\`\``)
                                .setColor(process.env.color);

                            // Send the embed and log the error
                            await message.channel.send(embed).catch(err => utils.logger.error(err));
                            utils.logger.error(err);
                            return;
                        }

                        // Create an embed
                        const embed = new MessageEmbed()
                            .setTitle('Changes Staged')
                            .setDescription(`\`\`\`\n${stdout}\n${stderr}\n\`\`\``)
                            .setColor(process.env.color);

                        // Send the embed
                        await message.channel.send(embed).catch(err => {utils.logger.error(err)});
                    });
                    
                });

                break;
            }

            // Unstages changes
            case 'unstage': {
                // Allows 'all' to be a valid arg
                if (args[0] === 'all') args.splice(0, 1, '.');

                // Execute the command
                exec(`git restore --staged ${args.join(' ')}`, async (err) => {
                    // If the command errors
                    if (err) {
                        // Create an embed
                        const embed = new MessageEmbed()
                            .setTitle('Error')
                            .setDescription(`\`\`\`\n${err}\n\`\`\``)
                            .setColor(process.env.color);

                        // Send the embed and log the error
                        await message.channel.send(embed).catch(err => utils.logger.error(err));
                        utils.logger.error(err);
                        return;
                    }

                    // Execute a status command for the embed
                    // The restore command doesn't have an stdout nor an stderr
                    exec('git status', async (err, stdout, stderr) => {
                        // If the command errors
                        if (err) {
                            // Create an embed
                            const embed = new MessageEmbed()
                                .setTitle('Error')
                                .setDescription(`\`\`\`\n${err}\n\`\`\``)
                                .setColor(process.env.color);

                            // Send the embed and log the error
                            await message.channel.send(embed).catch(err => utils.logger.error(err));
                            utils.logger.error(err);
                            return;
                        }
                        
                        // Create an embed
                        const embed = new MessageEmbed()
                            .setTitle('Changes Unstaged')
                            .setDescription(`\`\`\`\n${stdout}\n${stderr}\n\`\`\``)
                            .setColor(process.env.color);

                        // Send the embed
                        await message.channel.send(embed).catch(err => {utils.logger.error(err)});
                    });
                });

                break;
            }

            // Commit all staged changes with a message
            case 'commit': {
                // Execute the command
                exec(`git commit -m "${args.join(' ')}"`, async (err, stdout, stderr) => {
                    // If the command errors
                    if (err) {
                        // Create an embed
                        const embed = new MessageEmbed()
                            .setTitle('Error')
                            .setDescription(`\`\`\`\n${err}\n\`\`\``)
                            .setColor(process.env.color);

                        // Send the embed and log the error
                        await message.channel.send(embed).catch(err => utils.logger.error(err));
                        utils.logger.error(err);
                        return;
                    }

                    // Create an embed
                    const embed = new MessageEmbed()
                        .setTitle('Git Committed')
                        .setDescription(`\`\`\`\n${stdout}\n${stderr}\n\`\`\``)
                        .setColor(process.env.color);
                    
                    // Send the embed
                    await message.channel.send(embed).catch(err => {utils.logger.error(err)});
                });

                break;
            }

            // Push all commits to the remote repo
            case 'push': {
                // Execute the command
                exec('git push origin master', async (err, stdout, stderr) => {
                    // If the command errors
                    if (err) {
                        // Create an embed
                        const embed = new MessageEmbed()
                            .setTitle('Error')
                            .setDescription(`\`\`\`\n${err}\n\`\`\``)
                            .setColor(process.env.color);

                        // Send the embed and log the error
                        await message.channel.send(embed).catch(err => utils.logger.error(err));
                        utils.logger.error(err);
                        return;
                    }

                    // Create an embed
                    const embed = new MessageEmbed()
                        .setTitle('Git Pushed')
                        .setDescription(`\`\`\`\n${stdout}\n${stderr}\n\`\`\``)
                        .setColor(process.env.color);

                    // Send the embed
                    await message.channel.send(embed).catch(err => {utils.logger.error(err)});
                });

                break;
            }

            // Pull all commits from the remote repo
            case 'pull': {
                exec('git pull origin master', async (err, stdout, stderr) => {
                    // If the command errors
                    if (err) {
                        // Create an embed
                        const embed = new MessageEmbed()
                            .setTitle('Error')
                            .setDescription(`\`\`\`\n${err}\n\`\`\``)
                            .setColor(process.env.color);

                        // Send the embed and log the error
                        await message.channel.send(embed).catch(err => utils.logger.error(err));
                        utils.logger.error(err);
                        return;
                    }
                    
                    // Create an embed
                    const embed = new MessageEmbed()
                        .setTitle('Git Pulled')
                        .setDescription(`\`\`\`\n${stdout}\n${stderr}\n\`\`\``)
                        .setColor(process.env.color);

                    // Send the embed
                    await message.channel.send(embed).catch(err => {utils.logger.error(err)});
                });

                break;
            }
        }

    } catch (err) {
        // Send and log any errors
        message.channel.send(err, {code: 'xl', split: true}).catch(err => utils.logger.error(err));
        utils.logger.error(err);
    }
};
