module.exports = {
    /**
     * @param {import('discord.js').Message} message
     * @param {string[]} args
     * @param {import('../utils')} utils
     */
    async execute(message, args, utils) {
        try {
            const guild = message.guild;
            const author = guild.members.cache.get(message.author.id);

            if (await utils.check(author, guild.id, {permissions: ['MANAGE_ROLES'], roles: ['admin', 'mod']}) === false) {
                throw new Error('Missing Permissions');
            }

            let members = [];
            for (arg in args) {
                
                let member;
                switch (args[arg].match(/[a-zA-Z]+/)) {
                    case null: {
                        member = message.guild.members.cache.find(member => member.id === args[arg].match(/\d{18}/)[0]);
                        break;
                    }

                    default: {
                        member = message.guild.members.cache.find(member => member.user.username === args[arg].match(/[a-zA-Z]+/)[0]);
                    }
                }

                members.push(member);
                await member.roles.add(['852245103691300904', '578216257434812426']);
            }

            await message.channel.send(`Bad ${members.join(' ')}! <a:spray:852243635785171006>`);

            setTimeout(async () => {
                for (member in members) {
                    await members[member].roles.remove(['852245103691300904', '578216257434812426']);
                }

            }, 5000);

        } catch (err) {
            await message.channel.send(err, {code: 'xl', split: true}).catch(err => utils.logger.error(err));
            utils.logger.error(err);
        }
    }
};
