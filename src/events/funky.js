/**
 * Opens and closes the Funky Monkey Friday channels in The Mighty Jungle
 * @param {import('discord.js').Client} client
 * @param {import('../utils')} utils
 * @param {number} day
 */
module.exports = async (client, utils, day) => {
    try {
        const guild = await client.guilds.cache.get('376505103923806219');
        const category = await guild.channels.cache.get('772074946791866390');
        const channel = await guild.channels.cache.get('738161372029911050');
        const role = await guild.roles.cache.get('716069629591814275');

        switch (day) {
            case 5: {
                category.updateOverwrite(role, {VIEW_CHANNEL: true});
                channel.updateOverwrite(role, {VIEW_CHANNEL: true});
                break;
            }

            case 6: {
                channel.updateOverwrite(role, {VIEW_CHANNEL: false});
                category.updateOverwrite(role, {VIEW_CHANNEL: false});
                break;
            }
        }

    } catch (err) {
        utils.logger.error(err);
    }
};
