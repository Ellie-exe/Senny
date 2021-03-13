const schedule = require('node-schedule');
const mariadb = require('mariadb');
/**
 * Fires when the bot is ready
 * @param {import('discord.js').Client} client
 * @param {import('../utils')} utils
 * @param {import('redis').RedisClient} cache
 */
module.exports = async (client, utils, cache) => {
    try {
        // Initialize counter to -1 so first time through it starts at 0
        let counter = -1;

        // Every 30 seconds cycle the status to the next one in list
        setInterval(async () => {
            // Every loop incriment the counter by one until you get to 3
            // The counter is reset at 3 so it goes 0 1 2 3 in a loop
            (counter === 3) ? counter = 0 : counter++;

            // List of status' to cycle through
            const activity = [
                {type: 'LISTENING', name: '/'},
                {type: 'WATCHING', name: 'over Bongo'},
                {type: 'PLAYING', name: 'with the API'},
                {type: 'WATCHING', name: `${client.guilds.cache.array().length} Guilds`}
            ];

            // Set the bot's status
            client.user.setActivity(activity[counter].name, {
                type: activity[counter].type
            });

        }, 30000); // The timer is set to 30 seconds

        // Connect to the database to grab persisting data
        const conn = await mariadb.createConnection({
            user: process.env.user,
            password: process.env.password,
            database: process.env.database
        });

        // Get all reminders, filters, and bump reminder settings
        // This is so reminders persist through restarts
        // This also loads filters and bump reminders into cache
        const reminders = await conn.query('SELECT * FROM reminders');
        const filters = await conn.query('SELECT * FROM filters');
        const bumps = await conn.query('SELECT * FROM bumps');

        // Set the regex filter in hash cache
        await filters.forEach(async filter => {
            await cache.hmsetAsync(filter.guildID, 'regex', filter.regex);
        });

        // Set bump reminders in cache
        // True is a dummy value because all we need is the guild ID
        await bumps.forEach(async bump => {
            await cache.hmsetAsync(bump.guildID, 'bump', true);
        });

        // Set each reminder again
        await reminders.forEach(async reminder => {
            const reminderID = reminder.reminderID; // The 5 letter reminder ID
            const text = reminder.text; // The text to remind
            const date = reminder.date; // The timestamp to remind at

            // Fetch the channel to send the reminder and the user to remind
            const channel = await client.channels.fetch(reminder.channelID);
            const user = await client.users.fetch(reminder.userID);

            // Schedule the job
            schedule.scheduleJob(date, async () => {
                try {
                    // Connect to the database again
                    const conn = await mariadb.createConnection({
                        user: process.env.user,
                        password: process.env.password,
                        database: process.env.database
                    });

                    // Send the reminder
                    await channel.send(`${user.toString()} you asked me to remind you about \`\`\`${text}\`\`\``);

                    // Remove the reminder from the database and end the connection
                    const sql = 'DELETE FROM reminders WHERE reminderID=(?)';
                    await conn.query(sql, [reminderID]);
                    await conn.end();

                } catch (err) {
                    // Log any errors
                    utils.logger.error(err);
                }
            });
        });

        // End the connection and log that the bot is all loaded and ready to go
        utils.logger.info(`Bot ready in ${client.guilds.cache.array().length} guilds`);
        await conn.end();

    } catch (err) {
        // Log any errors
        utils.logger.error(err);
    }
};
