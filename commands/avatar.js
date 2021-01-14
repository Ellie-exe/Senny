const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'avatar',
    async execute(i) {
        const user_id = i.data.options ? i.data.options[0].value : i.user.id;
        const user_av = i.client.users.cache.get(user_id);
        const avatar = user_av.displayAvatarURL().concat('?size=4096');

        const embed = new MessageEmbed()
            .setTitle(user_av.tag)
            .setImage(avatar)
            .setColor(process.env.color);
                
        i.embed(embed);
    }
};