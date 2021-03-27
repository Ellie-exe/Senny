/**
 * @param {import('discord.js').GuildMember} member
 * @param {import('../utils')} utils
 */
 module.exports = async (member, utils) => {
    try {
        if (member.guild.id !== '573272766149558272') return;
        if (member.user.bot) await newMember.roles.add('578189625575604224');
    
    } catch (err) {
        utils.logger.error(err);
    }
}
