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
            const category = /** @type {import('discord.js').CategoryChannel} */ guild.channels.cache.get('772074946791866390');
            const channel = /** @type {import('discord.js').TextChannel} */ guild.channels.cache.get('738161372029911050');
            const role = guild.roles.cache.get('716069629591814275');

            const announcements = [
                `Happy funky monkey Friday ${role}`,
                `It's time to get funky ${role}`,
                `${role} you know what time it is :D`,
                `${role} it's funky time!`,
                `${role} do you know what day it is? It's funky monkey Friday!`,
                `Let's get our funk on ${role}`,
                `${role} TGIF let's get funky!`
            ];

            switch (day) {
                case 'Friday': {
                    await category.permissionOverwrites.edit(role, { ViewChannel: true });
                    await channel.permissionOverwrites.edit(role, { ViewChannel: true });

                    await channel.send(announcements[Math.floor(Math.random() * announcements.length)]);
                    break;
                }

                case 'Saturday': {
                    await channel.permissionOverwrites.edit(role, { ViewChannel: false });
                    await category.permissionOverwrites.edit(role, { ViewChannel: false });
                    break;
                }
            }

        } catch (err) {
            logger.error(err.stack);
        }
    }
};
