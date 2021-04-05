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
                    await message.react(utils.constants.emojis.greenTick);
                    exec('pm2 stop config.json && pm2 save');
                    break;
                }

                case 'update': {
                    exec('npm i', async (err, stdout, stderr) => {
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
                            .setTitle('Packages Updated')
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
