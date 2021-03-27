const schedule = require('node-schedule');
const mariadb = require('mariadb');
/**
 * @param {import('discord.js').Client} client
 * @param {import('../utils')} utils
 * @param {import('redis').RedisClient} cache
 */
module.exports = async (client, utils, cache) => {
    try {
        let counter = -1;

        setInterval(async () => {
            (counter === 3) ? counter = 0 : counter++;

            const activity = [
                {type: 'LISTENING', name: '/'},
                {type: 'WATCHING', name: 'over Bongo'},
                {type: 'PLAYING', name: 'with the API'},
                {type: 'WATCHING', name: `${client.guilds.cache.array().length} Guilds`}
            ];

            client.user.setActivity(activity[counter].name, {
                type: activity[counter].type
            });

        }, 30000);

        const conn = await mariadb.createConnection({
            user: process.env.user,
            password: process.env.password,
            database: process.env.database
        });

        const reminders = await conn.query('SELECT * FROM reminders');
        const filters = await conn.query('SELECT * FROM filters');
        const bumps = await conn.query('SELECT * FROM bumps');

        await filters.forEach(async filter => {
            await cache.hmsetAsync(filter.guildID, 'regex', filter.regex);
        });

        await bumps.forEach(async bump => {
            await cache.hmsetAsync(bump.guildID, 'bump', true);
        });

        await reminders.forEach(async reminder => {
            const reminderID = reminder.reminderID;
            const text = reminder.text;
            const date = reminder.date;

            const channel = await client.channels.fetch(reminder.channelID);
            const user = await client.users.fetch(reminder.userID);

            schedule.scheduleJob(date, async () => {
                try {
                    const conn = await mariadb.createConnection({
                        user: process.env.user,
                        password: process.env.password,
                        database: process.env.database
                    });

                    await channel.send(`${user.toString()} you asked me to remind you about \`\`\`${text}\`\`\``);

                    const sql = 'DELETE FROM reminders WHERE reminderID=(?)';
                    await conn.query(sql, [reminderID]);
                    await conn.end();

                } catch (err) {
                    utils.logger.error(err);
                }
            });
        });

        utils.logger.info(`Bot ready in ${client.guilds.cache.array().length} guilds`);
        await conn.end();

    } catch (err) {
        utils.logger.error(err);
    }
};
