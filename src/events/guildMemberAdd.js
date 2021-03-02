/**
 * Fires every time someone joins a server
 * @param {import('discord.js').GuildMember} member
 * @param {import('../../types').Utils} utils
 */
module.exports = async (member, utils) => {
    try {
        // Hard code this to only work in RedNet
        if (member.guild.id !== '573272766149558272') return;

        // Check if the member is a bot
        switch (member.user.bot) {
            // If the member is a bot
            case true: {
                // Add the bot role
                await member.roles.add('578189625575604224');
                break;
            }

            // If the member is a user
            case false: {
                // Add the user role
                await member.roles.add('578211559390576640');
                break;
            }
        }

        // For each flag the member has
        member.user.flags?.toArray().forEach(async flag => {
            // Check the name of the flag
            switch (flag) {
                // If the member is in the Balance house
                case 'HOUSE_BALANCE': {
                    // Add the Balance role
                    await member.roles.add('582359823610544171');
                    break;
                }

                // If the member is in the Bravery house
                case 'HOUSE_BRAVERY': {
                    // Add the Bravery role
                    await member.roles.add('582359813992874035');
                    break;
                }

                // If the member is in the Brilliance house
                case 'HOUSE_BRILLIANCE': {
                    // Add the Brilliance role
                    await member.roles.add('582359819047010324');
                    break;
                }
            }
        });
    
    } catch (err) {
        // Log any errors
        utils.logger.error(err);
    }
}