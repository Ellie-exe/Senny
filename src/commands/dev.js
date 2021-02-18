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
            case 'reload': {
                await message.react(utils.constants.emojis.greenTick);
                require('../index').reload();
                break;
            }

            case 'restart': {
                await message.react(utils.constants.emojis.greenTick);
                exec('pm2 restart config.json && pm2 save');
                break;
            }

            case 'stop': {
                message.react(utils.constants.emojis.greenTick);
                exec('pm2 stop config.json && pm2 save');
                break;
            }

            case 'update': {
                exec('npm i', (err, stdout, stderr) => {
                    if (err) {
                        const embed = new MessageEmbed()
                            .setTitle('Error')
                            .setDescription(`\`\`\`\n${err}\n\`\`\``)
                            .setColor(process.env.color);

                        message.channel.send(embed).catch(err => utils.logger.error(err));
                        utils.logger.error(err);

                    } else {
                        const embed = new MessageEmbed()
                            .setTitle('Packages Updated')
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
