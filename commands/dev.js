module.exports = {
    name: 'dev',
    async execute(message, args) {
        const constants = require('../utils/constants');
        const {MessageEmbed} = require('discord.js');
        const logger = require('@jakeyprime/logger');
        const {exec} = require('child_process');

        if(process.env.owners.includes(message.author.id) === false) {
            message.channel.send(`${constants.emojis.redX} Error: \`DiscordAPIError: Missing Permissions\``);
            return;
        }

        switch (args[0]) {
            case 'restart': {
                try {
                    message.react(constants.emojis.greenTick);
                    exec('pm2 restart config.json && pm2 save');
                
                } catch (err) {
                    logger.error(err);
                
                }

                break;
            }

            case 'stop': {
                try {
                    message.react(constants.emojis.greenTick);
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

                exec('npm i', (err, stdout, stderr) => {
                    if (err) {
                        logger.error(err);
                        message.channel.send(`\`\`\`\n${err}\n\`\`\``);
        
                    } else {
                        const embed = new MessageEmbed()
                            .setTitle('Packages Updated')
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