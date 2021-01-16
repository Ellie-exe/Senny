module.exports = {
    name: 'avatar',
    async execute(command) {
        const {MessageEmbed} = require('discord.js');

        const user_id = command.data.options ? command.data.options[0].value : command.user.id;
        const user = command.client.users.cache.get(user_id);
        const avatar = user.displayAvatarURL().concat('?size=4096');

        const embed = new MessageEmbed()
            .setAuthor(user.tag)
            .setImage(avatar)
            .setColor(process.env.color);
                
        command.embed(embed);
    }
};