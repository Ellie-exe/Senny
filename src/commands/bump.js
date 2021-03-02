const schedule = require('node-schedule');
const dateFormat = require('dateformat');
const mariadb = require('mariadb');
/**
 * Reminds a user to bump after 2 hours
 * @param {import('discord.js').Message} message
 * @param {import('../../types').Utils} utils
 */
module.exports.execute = async (message, utils) => {
    try {
        const user = message.author; // The command author
        const channel = message.channel; // The current channel
        const date = Date.now() + 7200000; // The current time plus 2 hours
        const displayDate = dateFormat(date, 'mmmm d, yyyy "at" h:MM TT Z'); // Format the date
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // The reminder ID chars
        const text = '!d bump'; // The reminder text to send
        
        let reminderID = ''; // The 5 letter reminder ID

        // Connect to the database
        const conn = await mariadb.createConnection({
            user: process.env.user,
            password: process.env.password,
            database: process.env.database
        });

        // Generate 5 random letters for the reminder ID
        for (let i = 0; i < 5; i++) {
            const num = Math.floor(Math.random() * chars.length);
            reminderID += chars.charAt(num);
        }

        // Insert the reminder into the database
        const sql = 'INSERT INTO reminders VALUES (?, ?, ?, ?, ?)';
        await conn.query(sql, [reminderID, channel.id, user.id, date, text]);
        
        // Send the confirmation message
        command.send(`${utils.constants.emojis.greenTick} __**Reminder set!**__ - \`${display}\`\n\`\`\`${text}\`\`\``);

        // Set the reminder
        schedule.scheduleJob(date, async () => {
            try {
                // Check the database to make sure the user didn't delete the reminder
                const sql = 'SELECT reminderID FROM reminders WHERE reminderID=(?)';
                const reminder = await conn.query(sql, [reminderID]);
                if (reminder.length === 0) return; // If they dud delete it then stop here

                // If they didn't delete it then send the reminder
                await channel.send(`__**Reminder!**__ - ${user.toString()}\n\`\`\`${text}\`\`\``);

                // Delete the reminder from the database and end this connection
                await conn.query('DELETE FROM reminders WHERE reminderID=(?)', [reminderID]);
                await conn.end();

            } catch (err) {
                // Log any errors
                utils.logger.error(err);
            }
        });

    } catch (err) {
        // Log any errors
        utils.logger.error(err);
    }
}
