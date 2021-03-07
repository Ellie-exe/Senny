const { MessageEmbed } = require('discord.js');
const schedule = require('node-schedule');
const dateFormat = require('dateformat');
const mariadb = require('mariadb');
/**
 * Reminds a user in either a channel or DMs
 * @param {import('../../types').Interaction} command
 * @param {import('../../types').Utils} utils
 */
module.exports.execute = async (command, utils) => {
    try {
        // Connect to the database
        const conn = await mariadb.createConnection({
            user: process.env.user,
            password: process.env.password,
            database: process.env.database
        });

        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // The reminder ID chars
        const data = command.data.options[0]; // The subcommand

        // Fetch the author
        const userID = command.authorID;
        const user = await command.client.users.fetch(userID);

        /**
         * Converts a duration string into milliseconds
         * @param {string} time
         */
        function parse(time) {
            // Split the duration apart into individual times
            const times = time.match(/\d+\s*\w+/g);

            // Default all values to 0
            let years = 0;
            let months = 0;
            let weeks = 0;
            let days = 0;
            let hours = 0;
            let minutes = 0;
            let seconds = 0;

            // Calculate each time's value in milliseconds
            times.forEach(time => {
                // Split the value and label apart
                const value = time.match(/\d+/g)[0];
                const label = time.match(/(?<=\s|\d)(mo|[ywdhms])/gi)[0];

                // Check the label
                switch (label) {
                    // If the label is years convert value to milliseconds
                    case 'y':
                        years = value * 365 * 24 * 60 * 60 * 1000;
                        break;

                    // If the label is months convert value to milliseconds
                    case 'mo':
                        months = value * 30 * 24 * 60 * 60 * 1000;
                        break;

                    // If the label is weeks convert value to milliseconds
                    case 'w':
                        weeks = value * 7 * 24 * 60 * 60 * 1000;
                        break;

                    // If the label is days convert value to milliseconds
                    case 'd':
                        days = value * 24 * 60 * 60 * 1000;
                        break;

                    // If the label is hours convert value to milliseconds
                    case 'h':
                        hours = value * 60 * 60 * 1000;
                        break;

                    // If the label is minutes convert value to milliseconds
                    case 'm':
                        minutes = value * 60 * 1000;
                        break;

                    // If the time is seconds convert value to milliseconds
                    case 's':
                        seconds = value * 1000;
                        break;
                }
            });

            // Add up all the times into the total duration in milliseconds
            return years + months + weeks + days + hours + minutes + seconds;
        }

        // Check the subcommand used
        switch (data.name) {
            // Remind the user in the current channel
            case 'here': {
                const type = data.options[0].value; // The type of date
                const time = data.options[1].value; // The time string
                const text = data.options[2].value; // The text to remind
                const channelID = command.channelID; // The channel ID to remind

                let date; // The date to set the reminder for
                let reminderID = ''; // The 5 letter reminder ID

                // Generate 5 random letters for the reminder ID
                for (let i = 0; i < 5; i++) {
                    const num = Math.floor(Math.random() * chars.length);
                    reminderID += chars.charAt(num);
                }

                // Check the type of date used
                switch (type) {
                    // If the date is a duration add duration to current time
                    case 'duration':
                        date = Date.now() + parse(time);
                        break;

                    // If the date is a date then parse the date
                    case 'date':
                        date = Date.parse(time);
                        break;
                }

                // Format the date to look better
                const display = dateFormat(date, 'mmmm d, yyyy "at" h:MM TT Z');

                // Fetch the channel to send the reminder in
                const channel = await command.client.channels.fetch(channelID);

                // Insert the reminder into the database
                const sql = 'INSERT INTO reminders VALUES (?, ?, ?, ?, ?)';
                await conn.query(sql, [reminderID, channelID, userID, date, text]);

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

                break;
            }

            // Remind the user in their DMs
            case 'me': {
                const type = data.options[0].value; // The type of date
                const time = data.options[1].value; // The time string
                const text = data.options[2].value; // The text to remind

                let date; // The date to set the reminder for
                let reminderID = ''; // The 5 letter reminder ID

                // Generate 5 random letters for the reminder ID
                for (let i = 0; i < 5; i++) {
                    const num = Math.floor(Math.random() * chars.length);
                    reminderID += chars.charAt(num);
                }

                // Check the type of date used
                switch (type) {
                    // If the date is a duration add duration to current time
                    case 'duration':
                        date = Date.now() + parse(time);
                        break;

                    // If the date is a date then parse the date
                    case 'date':
                        date = Date.parse(time);
                        break;
                }

                // Format the date to look better
                const display = dateFormat(date, 'mmmm d, yyyy "at" h:MM TT Z');

                // Create a DM with the user and get the channel ID
                const channel = await user.createDM();
                const channelID = channel.id;

                // Insert the reminder into the database
                const sql = 'INSERT INTO reminders VALUES (?, ?, ?, ?, ?)';
                await conn.query(sql, [reminderID, channelID, userID, date, text]);

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

                break;
            }

            // List all of the user's reminders
            case 'list': {
                // Get all of the user's reminders
                const reminders = await conn.query('SELECT * FROM reminders WHERE userID=(?)', [userID]);

                // Create the embed
                const embed = new MessageEmbed()
                    .setAuthor(`${user.tag} - Reminders`)
                    .setColor(process.env.color);

                // Check if the user has reminders
                if (reminders.length === 0) {
                    embed.setDescription('You have no reminders');

                // If they do have reminders
                } else {
                    // For each reminder
                    reminders.forEach(async reminder => {
                        const date = reminder.date; // The date the reminder is for
                        const text = reminder.text; // The text to be reminded about

                        // Fetch the channel the reminder is to be sent in
                        const channelID = reminder.channelID;
                        const channel = await command.client.channels.fetch(channelID);

                        // Add the reminder to the embed as a field
                        embed.addField(
                            `Reminder [\`${reminder.reminderID}\`]`,
                            `Destination: ${channel}\n`+
                            `Time: \`${dateFormat(date, 'mmmm d, yyyy "at" h:MM TT Z')}\`\n`+
                            `Text: \`${text}\``
                        );
                    });
                }

                // Send the embed
                command.embed([embed]);
                break;
            }

            // Delete a reminder or all reminders
            case 'delete': {
                // Make sure reminder ID is all upper case
                const reminderID = data.options[0].value.toUpperCase();

                // If the user wants to delete all their reminders
                if (reminderID === 'ALL') {
                    // Check the database to make sure they have reminders to delete
                    const reminders = await conn.query('SELECT * FROM reminders WHERE userID=(?)', [userID]);
                    if (reminders.length === 0) throw new Error('You have no reminders to delete');

                    // For each reminder the user has
                    reminders.forEach(async reminder => {
                        // Delete the reminder from the database
                        await conn.query('DELETE FROM reminders WHERE reminderID=(?)', [reminder.reminderID]);
                    });

                    // Send a confirmation message
                    command.send(`${utils.constants.emojis.greenTick} __**Reminders deleted!**__ - \`All\``);

                    // End the database connection and stop here
                    await conn.end();
                    return;
                }

                // If the user only wants to delete one reminder, get the reminder from the database
                const reminder = await conn.query('SELECT * FROM reminders WHERE reminderID=(?)', [reminderID]);

                // Make sure that the reminder exists and/or doesn't belong to another user
                if (reminder.length === 0) throw new Error('That reminder does not exist');
                if (reminder[0].userID !== user.id) throw new Error('You cannot delete someone else\'s reminders');

                // Delete the reminder from the database and send a confirmation message
                await conn.query('DELETE FROM reminders WHERE reminderID=(?)', [reminderID]);
                command.send(`${utils.constants.emojis.greenTick} __**Reminder deleted!**__ - \`${reminderID}\``);

                // End the database connection
                await conn.end();
                break;
            }
        }

    } catch (err) {
        // Log any errors
        command.error(err);
    }
};
