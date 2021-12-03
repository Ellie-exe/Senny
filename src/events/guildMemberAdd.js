module.exports = {
    name: 'guildMemberAdd',
    /** @param {import('discord.js/typings').GuildMember} member */
    async execute(member) {
        try {
            if (member.guild.id !== '573272766149558272') return;
            if (member.user.bot) await member.roles.add('578189625575604224');

        } catch (err) {
            logger.error(err);
        }
    }
};
