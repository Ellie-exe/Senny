/**
 * Fires every time a member is updated in the guild
 * @param {import('discord.js').GuildMember} oldMember
 * @param {import('discord.js').GuildMember} newMember
 * @param {import('../utils')} utils
 */
module.exports = async (oldMember, newMember, utils) => {
    try {
        if (newMember.guild.id !== '573272766149558272') return;

        if (oldMember.pending && !newMember.pending && !newMember.user.bot) {
            await newMember.roles.add('578211559390576640');

            newMember.user.flags?.toArray().forEach(async flag => {
                switch (flag) {
                    case 'HOUSE_BALANCE': {
                        await newMember.roles.add('582359823610544171');
                        break;
                    }

                    case 'HOUSE_BRAVERY': {
                        await newMember.roles.add('582359813992874035');
                        break;
                    }

                    case 'HOUSE_BRILLIANCE': {
                        await newMember.roles.add('582359819047010324');
                        break;
                    }
                }
            });
        }
    
    } catch (err) {
        utils.logger.error(err);
    }
}
