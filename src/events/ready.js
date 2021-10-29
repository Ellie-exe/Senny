module.exports = {
    name: 'ready',
    async execute() {
        try {
            const commands = await client.application.commands.fetch();

            client.commands.each(async cmd => {
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

            commands.each(async command => {
                const data = client.commands.find(c => c.data.find(d => d.name === command.name && d.type === command.type));

                if (data === undefined) {
                    await command.delete();
                    logger.debug(`Deleted ${command.type} Command: ${command.name}`);
                }
            });

            logger.info(`Ready to serve ${client.guilds.cache.reduce((users, guild) => users + guild.memberCount, 0)} users in ${client.guilds.cache.size} servers.`);

        } catch (err) {
            logger.error(err);
        }
    }
};
