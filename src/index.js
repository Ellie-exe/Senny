const logger = require('@jakeyprime/logger');
const discord = require('discord.js');

const client = new discord.Client({intents: [discord.Intents.FLAGS.GUILDS]});

global.discord = discord;
global.client = client;
global.logger = logger;

client.commands = new discord.Collection();

const commands = require('./commands');
Object.values(commands).forEach(command => {
    client.commands.set(command.data[0].name, command);
});

const events = require('./events');
Object.values(events).forEach(event => {
    client.on(event.name, (...args) => event.execute(...args));
});

client.login(process.env.TOKEN);