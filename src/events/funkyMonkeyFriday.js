module.exports = {
    name: 'funkyMonkeyFriday',
    /** @param {String} day */
    async execute(day) {
        try {
            const guild = client.guilds.cache.get('376505103923806219');
            const category = guild.channels.cache.get('772074946791866390');
            const channel = guild.channels.cache.get('738161372029911050');
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
                    await category.permissionOverwrites.edit(role, { VIEW_CHANNEL: true });
                    await channel.permissionOverwrites.edit(role, { VIEW_CHANNEL: true });

                    await channel.send(announcements[Math.floor(Math.random() * announcements.length)]);
                    break;
                }

                case 'Saturday': {
                    await channel.permissionOverwrites.edit(role, { VIEW_CHANNEL: false });
                    await category.permissionOverwrites.edit(role, { VIEW_CHANNEL: false });
                    break;
                }
            }

        } catch (err) {
            logger.error(err);
        }
    }
};
