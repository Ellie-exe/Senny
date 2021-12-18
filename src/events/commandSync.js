module.exports = {
    name: 'commandSync',
    async execute() {
        try {
            const commands = await client.application.commands.fetch();

            client.commands.filter(cmd => !cmd.flags.guild && !cmd.flags.developer).each(async cmd => {
                for (const data of cmd.data) {
                    const command = commands.find(c => c.name === data.name && c.type === data.type);

                    if (command === undefined) {
                        await client.application.commands.create(data);
                        logger.debug(`Created ${data.type} Command: ${data.name}`);

                    } else if (!command.equals(data)) {
                        await command.edit(data);
                        logger.debug(`Updated ${data.type} Command: ${data.name}`);
                    }
                }
            });

            client.commands.filter(cmd => cmd.flags.guild && !cmd.flags.developer).each(async cmd => {
                const guild = client.guilds.cache.get(cmd.flags.guild);
                const guildCommands = await guild.commands.fetch();

                for (const data of cmd.data) {
                    const command = guildCommands.find(c => c.name === data.name && c.type === data.type);

                    if (command === undefined) {
                        await guild.commands.create(data);
                        logger.debug(`Created ${data.type} Command in Guild ${guild.name}: ${data.name}`);

                    } else if (!command.equals(data)) {
                        await command.edit(data);
                        logger.debug(`Updated ${data.type} Command in Guild ${guild.name}: ${data.name}`);
                    }
                }
            });

            commands.each(async command => {
                const data = client.commands.find(c => c.data.find(d => d.name === command.name && d.type === command.type));

                if (data === undefined) {
                    await command.delete();
                    logger.debug(`Deleted ${command.type} Command: ${command.name}`);
                }
            });

            client.guilds.cache.each(async guild => {
                const guildCommands = await guild.commands.fetch();

                guildCommands.each(async command => {
                    const data = client.commands.find(c => c.data.find(d => d.name === command.name && d.type === command.type));

                    if (data === undefined) {
                        await command.delete();
                        logger.debug(`Deleted ${command.type} Command from Guild ${guild.name}: ${command.name}`);
                    }
                });
            });

        } catch (err) {
            logger.error(err);
        }
    }
};
