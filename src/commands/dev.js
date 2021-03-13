const { MessageEmbed } = require('discord.js');
const { exec } = require('child_process');
/**
 * Developer commands
 * @param {import('discord.js').Message} message
 * @param {string[]} args
 * @param {import('../utils')} utils
 */
module.exports.execute = async (message, args, utils) => {
    try {
        // Check if the author is a dev
        if(!process.env.admins.includes(message.author.id)) throw new Error('Missing Permissions');
        const option = args.shift().toLowerCase(); // The subcommand

        // Check which subcommand was used
        switch (option) {
            // Reload the commands and events
            case 'reload': {
                // Add a confirmation reaction and call the reload function
                await message.react(utils.constants.emojis.greenTick);
                require('../index').reload();
                break;
            }

            // Restart the bot
            case 'restart': {
                // Add a confirmation reaction and execute the command
                await message.react(utils.constants.emojis.greenTick);
                exec('pm2 restart config.json && pm2 save');
                break;
            }

            // Turn off the bot
            case 'stop': {
                // Add a confirmation reaction and execute the command
                await message.react(utils.constants.emojis.greenTick);
                exec('pm2 stop config.json && pm2 save');
                break;
            }

            // Update the bot's packages
            case 'update': {
                // Execute the command
                exec('npm i', async (err, stdout, stderr) => {
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
                        .setTitle('Packages Updated')
                        .setDescription(`\`\`\`\n${stdout}\n${stderr}\n\`\`\``)
                        .setColor(process.env.color);

                    // Send the embed
                    message.channel.send(embed).catch(err => {utils.logger.error(err)});
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
