const { MessageEmbed } = require("discord.js");
/**
 * @param {import('../../types').Interaction} command
 * @param {import('../../types').Utils} utils
 */
module.exports.execute = async (command, utils) => {
    try {
        const args = command.data.options[0].value;
        const emojiID = args.match(/\d/g).join('');
        const emoji = command.client.emojis.cache.get(emojiID);
        
        const embed = new MessageEmbed()
            .setAuthor(`${emoji.name} - Jumbo`, null, emoji.url)
            .setImage(emoji.url)
            .setColor(process.env.color);

        command.embed([embed]);
    
    } catch (err) {
        command.send(`${utils.constants.emojis.redX} Error: \`${err}\``, {type: 3, flags: 64});
        utils.logger.error(err);
    }
};