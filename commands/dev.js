const { exec } = require('child_process');
const logger = require('@jakeyprime/logger');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'dev',
    async execute(message, args) {
        if(process.env.owners.includes(message.author.id) === false) {
            message.channel.send('<:red_x:717257458657263679> Error: `DiscordAPIError: Missing Permissions`');
            return;
        }

        switch (args[0]) {
            case 'restart': {
                try {
                    message.react('<:green_tick:717257440202326058>');
                    exec('pm2 restart config.json && pm2 save');
                
                } catch (err) {
                    logger.error(err);
                
                }

                break;
            }

            case 'stop': {
                try {
                    message.react('<:green_tick:717257440202326058>');
                    exec('pm2 stop config.json && pm2 save');

                } catch (err) {
                    logger.error(err);
                
                }

                break;
            }

            case 'pull': {
                exec('git pull origin master', (err, stdout, stderr) => {
                    if (err) {
                        logger.error(err);
                        message.channel.send(`\`\`\`\n${err}\n\`\`\``);
        
                    } else {
                        const embed = new MessageEmbed()
                            .setTitle('Git Pulled')
                            .setDescription(`\`\`\`\n${stdout}\n${stderr}\n\`\`\``)
                            .setColor(process.env.color);
                            
                        message.channel.send(embed);
                    }
                });

                break;
            }
        }
    }
};