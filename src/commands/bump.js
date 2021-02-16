const schedule = require('node-schedule');
const dateFormat = require('dateformat');
const Enmap = require('enmap');
/**
 * @param {import('../../types').Message} message 
 * @param {import('../../types').Utils} utils 
 */
module.exports.execute = async (message, utils) => {
    try {
        const date = Date.now() + 7200000;
        const displayDate = dateFormat(date, 'mmmm d, yyyy "at" h:MM TT Z');
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const text = '!d bump';

        const reminder = new Enmap({name: 'reminder'});

        let reminderID = '';
        for (let i = 0; i < 5; i++) reminderID += characters.charAt(Math.random() * characters.length);

        reminder.set(reminderID, {
            authorID: message.author.id,
            channelID: message.channel.id,
            channelType: message.channel.type,
            date: date,
            text: text
        });
        
        await message.channel.send(`Okay, I'll remind ${message.channel} about: \`!d bump\` at: \`${displayDate}\``);

        schedule.scheduleJob(date, async () => {
            try {
                if (reminder.indexes.includes(reminderID)) {
                    await message.channel.send(`Hello ${message.author.toString()}! You asked me to remind you about: \`${text}\``);
                    reminder.delete(reminderID);
                }
            
            } catch (err) {
                message.channel.send(`${utils.constants.emojis.redX} Error: \`${err}\``).catch(err => utils.logger.error(err));
                utils.logger.error(err);
            }
        });

    } catch (err) {
        message.channel.send(`${utils.constants.emojis.redX} ${err.name}: \`${err.message}\``).catch(err => utils.logger.error(err));
        utils.logger.error(err);
    }
}