/**
 * Fires every time a member is updated in the guild
 * @param {import('discord.js').GuildMember} oldMember
 * @param {import('discord.js').GuildMember} newMember
 * @param {import('../utils')} utils
 */
module.exports = async (oldMember, newMember, utils) => {
    try {
        // Hard code this to only work in RedNet
        if (newMember.guild.id !== '573272766149558272') return;

        // Check if the old member is pending and the new member is not pending
        // This is so it only fires for new members and not non-pending member existing members
        if (oldMember.pending === true && newMember.pending === false) {
            // Check if the member is a bot
            switch (newMember.user.bot) {
                // If the member is a bot
                case true: {
                    // Add the bot role
                    await newMember.roles.add('578189625575604224');
                    break;
                }

                // If the member is a user
                case false: {
                    // Add the user role
                    await newMember.roles.add('578211559390576640');
                    break;
                }
            }

            // For each flag the member has
            newMember.user.flags?.toArray().forEach(async flag => {
                // Check the name of the flag
                switch (flag) {
                    // If the member is in the Balance house
                    case 'HOUSE_BALANCE': {
                        // Add the Balance role
                        await newMember.roles.add('582359823610544171');
                        break;
                    }

                    // If the member is in the Bravery house
                    case 'HOUSE_BRAVERY': {
                        // Add the Bravery role
                        await newMember.roles.add('582359813992874035');
                        break;
                    }

                    // If the member is in the Brilliance house
                    case 'HOUSE_BRILLIANCE': {
                        // Add the Brilliance role
                        await newMember.roles.add('582359819047010324');
                        break;
                    }
                }
            });
        }
    
    } catch (err) {
        // Log any errors
        utils.logger.error(err);
    }
}
