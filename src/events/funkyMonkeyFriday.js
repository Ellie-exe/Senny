const { logger } = require('../utils');

module.exports = {
    name: 'funkyMonkeyFriday',

    /**
     * @param {String} day
     * @param {import('discord.js').Client} client
     */
    async execute(day, client) {
        try {
            const guild = client.guilds.cache.get('376505103923806219');
            const channel = /** @type {import('discord.js').TextChannel} */ guild.channels.cache.get('738161399548870756');
            const role = guild.roles.cache.get('376505103923806219');

            switch (day) {
                case 'Friday': {
                    await channel.permissionOverwrites.edit(role, { ViewChannel: true });
                    break;
                }

                case 'Saturday': {
                    await channel.permissionOverwrites.edit(role, { ViewChannel: false });
                    break;
                }
            }

        } catch (err) {
            logger.error(err.stack);
        }
    }
};
