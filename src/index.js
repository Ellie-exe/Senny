const {SlashCommandBuilder} = require('@discordjs/builders');
const {Sequelize, DataTypes} = require('sequelize');
const logger = require('@jakeyprime/logger');
const discord = require('discord.js');

const client = new discord.Client({intents: [discord.Intents.FLAGS.GUILDS]});

const sequelize = new Sequelize('test', 'senny', 'pants777', {
    host: 'localhost',
    dialect: 'mariadb',
    logging: msg => logger.info(msg),
});

global.SlashCommand = SlashCommandBuilder;
global.MessageEmbed = discord.MessageEmbed;
global.sequelize = sequelize;
global.DataTypes = DataTypes;
global.logger = logger;
global.client = client;

client.commands = new discord.Collection();

const commands = require('./commands');
Object.values(commands).forEach(command => {
    client.commands.set(command.data.name, command);
});

const events = require('./events');
Object.values(events).forEach(event => {
    client.on(event.name, (...args) => event.execute(...args));
});

client.login(process.env.TOKEN);
