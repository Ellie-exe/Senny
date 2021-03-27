const discord = require('discord.js');
const utils = require('./utils');
const redis = require('redis');
const schedule = require('node-schedule');
const { promisifyAll } = require('bluebird');

promisifyAll(redis);

let commands = require('./commands');
let events = require('./events');
let dev = require('./dev');

const client = new discord.Client();
const cache = redis.createClient();

schedule.scheduleJob('0 0 0 * * 5', async () => {
    events.funky(client, utils, 5);
});

schedule.scheduleJob('0 0 0 * * 6', async () => {
    events.funky(client, utils, 6);
});

client.on('guildMemberAdd', member => {
    events.guildMemberAdd(member, utils);
});

client.on('guildMemberUpdate', (oldMember, newMember) => {
    events.guildMemberUpdate(oldMember, newMember, utils);
});

client.ws.on('INTERACTION_CREATE', async data => {
    client.emit('interaction', new utils.Interaction(data, client, utils));
});

client.on('interaction', interaction => {
    events.interaction(interaction, commands, utils, cache);
});

client.on('message', messsage => {
    events.message(messsage, dev, utils, cache);
});

client.on('ready', async () => {
    await utils.sync(commands, client);
    events.ready(client, utils, cache);
});

client.on('shardError', err => {
    events.shardError(err, utils);
});

client.on('shardReconnecting', () => {
    events.shardReconnecting(utils);
});

process.on('unhandledRejection', err => {
    events.unhandledRejection(err, utils);
});

module.exports.reload = async function reload() {
    for (const command in commands) {
        delete require.cache[require.resolve(`./commands/${command}`)];
    }

    delete require.cache[require.resolve('./commands')];
    commands = require('./commands');

    for (const command in dev) {
        delete require.cache[require.resolve(`./dev/${command}`)];
    }

    delete require.cache[require.resolve('./dev')];
    dev = require('./dev');

    for (const event in events) {
        delete require.cache[require.resolve(`./events/${event}`)];
    }

    delete require.cache[require.resolve('./events')];
    events = require('./events');

    await utils.sync(commands, client);
};

client.login(process.env.token);
