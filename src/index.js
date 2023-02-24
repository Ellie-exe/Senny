const { Client, Collection, GatewayIntentBits } = require('discord.js');
const schedule = require('node-schedule');
const { logger } = require('./utils');
const mongoose = require('mongoose');

try {
    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildMembers
        ]
    });

    mongoose.set('strictQuery', false);
    mongoose.connect(process.env.MONGO_URI);

    client.commands = new Collection();

    for (const command of require('./commands')) {
        client.commands.set(command.data.name, command);
    }

    for (const event of require('./events')) {
        client.on(event.name, (...args) => event.execute(...args));
    }

    process.on('unhandledRejection', async (reason) => {
        logger.error(reason.stack);
    });

    process.on('uncaughtException', async (err) => {
        logger.error(err.stack);
    });

    process.on('warning', async (warning) => {
        logger.warn(warning.stack);
    });

    schedule.scheduleJob('0 0 0 * * 5', async () => {
        client.emit('funkyMonkeyFriday', 'Friday', client);
    });

    schedule.scheduleJob('0 0 0 * * 6', async () => {
        client.emit('funkyMonkeyFriday', 'Saturday', client);
    });

    schedule.scheduleJob('0 0 12 * * *', async () => {
        client.emit('questionOfTheDay', client);
    });

    client.login(process.env.TOKEN);

} catch (err) {
    logger.error(err.stack);
}
