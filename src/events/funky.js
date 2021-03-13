/**
 * Opens and closes the Funky Monkey Friday channels in The Mighty Jungle
 * @param {import('discord.js').Client} client
 * @param {import('../utils')} utils
 * @param {number} day
 */
module.exports = async (client, utils, day) => {
    try {
        // Get everything from hard coded IDs
        const guild = await client.guilds.cache.get('376505103923806219');
        const category = await guild.channels.cache.get('772074946791866390');
        const channel = await guild.channels.cache.get('738161372029911050');
        const role = await guild.roles.cache.get('716069629591814275');

        // Either Friday or Saturday
        switch (day) {
            case 5: {
                // Open up the channels on Friday at midnight
                // Channel is done separately as it's the announcement channel and isn't synced
                category.updateOverwrite(role, {VIEW_CHANNEL: true});
                channel.updateOverwrite(role, {VIEW_CHANNEL: true});
                break;
            }

            case 6: {
                // Close the channels on Saturday at midnight
                // Channel is done separately as it's the announcement channel and isn't synced
                channel.updateOverwrite(role, {VIEW_CHANNEL: false});
                category.updateOverwrite(role, {VIEW_CHANNEL: false});
                break;
            }
        }

    } catch (err) {
        // Log any errors
        utils.logger.error(err);
    }
};
