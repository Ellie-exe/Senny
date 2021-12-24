module.exports = {
    /** @param {import('discord.js/typings').CommandInteraction} command */
    async execute(command) {
        try {
            if (command.user.id !== process.env.OWNER_ID) return await command.reply('You are not a developer');

            const perms = [{
                id: process.env.OWNER_ID,
                type: 'USER',
                permission: true
            }]

            const guild = command.guild;
            const commands = await guild.commands.fetch();

            if (commands.size === 0) {
                client.commands.each(async cmd => {
                    if (!cmd.flags.developer) return;

                    for (const data of cmd.data) {
                        const newCommand = await guild.commands.create(data);
                        await guild.commands.permissions.add({command: newCommand, permissions: perms});

                        logger.debug(`Created ${data.type} Command: ${data.name}`);
                    }
                });

                await command.reply('All dev commands have been added');

            } else {
                commands.each(async cmd => {
                    await guild.commands.delete(cmd);
                    logger.debug(`Deleted ${cmd.type} Command: ${cmd.name}`);
                });

                await command.reply('All dev commands have been removed');
            }

        } catch (err) {
            logger.error(err);
        }
    },

    data: [
        {
            type: 'CHAT_INPUT',
            name: 'dev',
            description: 'Toggles developer commands in this server'
        }
    ],

    flags: {
        developer: false,
        guild: false
    }
};
