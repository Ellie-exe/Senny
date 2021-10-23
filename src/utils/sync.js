const logger = require('@jakeyprime/logger');
const _ = require('lodash');

module.exports = async (commands, client) => {
    await client.api
        .applications(client.user.id)
        .commands
        .get()
        .then(async (res) => {
            for (const command in commands) {
                const cmd = res.find(cmd => cmd.name === commands[command].data.name);
                const keys = Object.keys(commands[command].data);

                if (!cmd) {
                    await client.api
                        .applications(client.user.id)
                        .commands
                        .post({data: commands[command].data})
                        .then(logger.info(`Created command ${commands[command].data.name}`))
                        .catch(err => logger.error(err));

                } else {
                    for (const key in keys) {
                        if (!_.isEqual(cmd[keys[key]], commands[command].data[keys[key]])) {
                            await client.api
                                .applications(client.user.id)
                                .commands
                                .post({data: commands[command].data})
                                .then(logger.info(`Updated command ${commands[command].data.name}`))
                                .catch(err => logger.error(err));
                        }
                    }
                }
            }

            res.forEach(async command => {
                if (!commands[command.name.match(/^\d/) ? '_' + command.name : command.name]) {
                    await client.api
                        .applications(client.user.id)
                        .commands(command.id)
                        .delete()
                        .then(logger.info(`Deleted command ${command.name}`))
                        .catch(err => logger.error(err));
                }
            });
        })
        .catch(err => logger.error(err));
}
