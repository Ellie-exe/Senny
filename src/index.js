const discord = require('discord.js');
const utils = require('./utils');
const redis = require('redis');
const { promisifyAll } = require('bluebird');
const schedule = require('node-schedule');

// Put redis in promie mode, this makes getting hash values easier
promisifyAll(redis);

// Load all commands and events so that they can be called later
let commands = require('./commands');
let events = require('./events');

// Create new discord and redis clients
const client = new discord.Client();
const cache = redis.createClient();

// Fires every Friday at midnight to open the Funky Monkey Friday channels
schedule.scheduleJob('0 0 0 * * 5', async () => {
    events.funky(client, utils, 5);
});

// Fires every Saturday at midnight to close the Funky Monkey Friday channels
schedule.scheduleJob('0 0 0 * * 6', async () => {
    events.funky(client, utils, 6);
});

// Fires every time someone joins a server
client.on('guildMemberAdd', member => {
    events.guildMemberAdd(member, utils);
});

// Listen for the interaction event from the gateway and emit a new event with an interaction object
client.ws.on('INTERACTION_CREATE', async data => {
    client.emit('interaction', new utils.Interaction(data, client, utils));
});

// Fires whenever an interaction is recieved
client.on('interaction', interaction => {
    events.interaction(interaction, commands, utils, cache);
});

// Fires every time a message is sent
client.on('message', messsage => {
    events.message(messsage, commands, utils, cache);
});

// Fires when the bot is ready
client.on('ready', () => {
    events.ready(client, utils, cache);
});

// Fires whenever a shard error gets thrown
client.on('shardError', err => {
    events.shardError(err, utils);
});

// Fires when the bot is reconnecting shards
client.on('shardReconnecting', () => {
    events.shardReconnecting(utils);
});

// Fires whenever a node.js error gets thrown so that all errors run through logger
process.on('unhandledRejection', err => {
    events.unhandledRejection(err, utils);
});

// The reload function has to be here because you cannot reload a command from inside a command
module.exports.reload = function reload() {
    // Delete each command from the cache
    for (const command in commands) {
        delete require.cache[require.resolve(`./commands/${command}`)];
    }

    // Delete the entire commands cache as well and reload it
    delete require.cache[require.resolve('./commands')];
    commands = require('./commands');

    // Delete cach event from the cache
    for (const event in events) {
        delete require.cache[require.resolve(`./events/${event}`)];
    }

    // Delete the entire events cache as well and reload it
    delete require.cache[require.resolve('./events')];
    events = require('./events');
};

// Connect this code with discord and the bot account
client.login(process.env.token);
