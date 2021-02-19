const discord = require('discord.js');
const utils = require('./utils');

let commands = require('./commands');
let events = require('./events');

const client = new discord.Client();
const filterCache = new discord.Collection();
const bumpCache = new discord.Collection();

const cache = {
    filter: filterCache,
    bump: bumpCache
}

client.ws.on('INTERACTION_CREATE', async data => {
    client.emit('interaction', new utils.Interaction(data, client, utils));
});

client.on('interaction', interaction => {
    events.interaction(interaction, commands, utils, cache);
});

client.on('message', messsage => {
    events.message(messsage, commands, utils, cache);
});

client.on('ready', () => {
    events.ready(client, utils, cache);
});

client.on('shardReady', () => {
    events.shardReady(client, utils);
});

client.on('shardReconnecting', () => {
    events.shardReconnecting(utils);
});

client.on('shardError', err => {
    events.shardError(err, utils);
});

process.on('unhandledRejection', err => {
    events.unhandledRejection(err, utils);
});

module.exports.reload = function reload() {
    for (const command in commands) {
        delete require.cache[require.resolve(`./commands/${command}`)];
    }

    delete require.cache[require.resolve('./commands')];
    commands = require('./commands');

    for (const event in events) {
        delete require.cache[require.resolve(`./events/${event}`)];
    }

    delete require.cache[require.resolve('./events')];
    events = require('./events');
}

client.login(process.env.token);