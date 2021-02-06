const Constants = require('./constants');
const Interaction = require('./interaction');
const logger = require('@jakeyprime/logger');
const Enmap = require('enmap');

class Utils {
    constructor() {
        this.constants = new Constants();
        this.logger = logger;
    }

    async interaction(data, client, utils) {
        return new Interaction(data, client, utils);
    }

    async isAdmin(author, guild) {
        const adminRole = new Enmap({name: 'adminRole'});
        return author.roles.cache.has(adminRole.get(guild));
    }

    async isMod(author, guild) {
        const modRole = new Enmap({name: 'modRole'});
        return author.roles.cache.has(modRole.get(guild));
    }
}

module.exports = new Utils();