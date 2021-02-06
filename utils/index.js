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
        const admin = await author.roles.cache.has(adminRole.get(guild));

        if (admin === true) return true;
        else return false;
    }

    async isMod(author, guild) {
        const modRole = new Enmap({name: 'modRole'});
        const mod = await author.roles.cache.has(modRole.get(guild));

        if (mod === true) return true;
        else return false;
    }

    async isStaff(author, guild) {
        const modRole = new Enmap({name: 'modRole'});
        const mod = await author.roles.cache.has(modRole.get(guild));
        
        const adminRole = new Enmap({name: 'adminRole'});
        const admin = await author.roles.cache.has(adminRole.get(guild));

        if (mod === true || admin === true) return true;
        else return false;
    }
}

module.exports = new Utils();