const { Sequelize, DataTypes } = require('sequelize');
const logger = require('@jakeyprime/logger');
const schedule = require('node-schedule');
const discord = require('discord.js');

const client = new discord.Client({intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_PRESENCES', 'GUILD_MESSAGES']});
const sequelize = new Sequelize('senny', process.env.USERNAME, process.env.PASSWORD, {
    host: 'localhost',
    dialect: 'mariadb'
});

global.DataTypes = DataTypes;
global.sequelize = sequelize;
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

schedule.scheduleJob('0 0 0 * * 5', async () => {
    client.emit('funkyMonkeyFriday', 'Friday');
});

schedule.scheduleJob('0 0 0 * * 6', async () => {
    client.emit('funkyMonkeyFriday', 'Saturday');
});

schedule.scheduleJob('0 0 12 * * *', async () => {
    client.emit('questionOfTheDay');
});

client.login(process.env.TOKEN);
