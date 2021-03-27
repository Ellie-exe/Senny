const logger = require('@jakeyprime/logger');
const _ = require('lodash');

module.exports = async (commands, client) => {
    await client.api
        .applications(client.user.id)
        .commands
        .get()
        .then(async res => {
            for (const command in commands) {
                const cmd = res.find(cmd => cmd.name === commands[command].data.name);
                const keys = Object.keys(commands[command].data);

                let post = false;

                if (!cmd) {
                    post = true

                } else {
                    for (const key in keys) {
                        if (!_.isEqual(cmd[keys[key]], commands[command].data[keys[key]])) {
                            post = true;
                        }
                    }
                }

                if (post) {
                    await client.api
                        .applications(client.user.id)
                        .commands
                        .post({data: commands[command].data})
                        .then(res => logger.info(res))
                        .catch(err => logger.error(err));
                }
            }

            res.forEach(async command => {
                if (!commands[command.name.match(/^\d/) ? '_' + command.name : command.name]) {
                    await client.api
                        .applications(client.user.id)
                        .commands(command.id)
                        .delete()
                        .then(res => logger.info(res))
                        .catch(err => logger.error(err));
                }
            });
        })
        .catch(err => logger.error(err));
}
