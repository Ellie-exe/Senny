const logger = require('@jakeyprime/logger');

module.exports = async (commands, client) => {
    await client.api
        .applications(client.user.id)
        .commands
        .get()
        .then(async res => {
            for (const command in commands) {
                if (!res.find(cmd => cmd.name === commands[command].json.name)) {
                    await client.api
                        .applications(client.user.id)
                        .commands
                        .post({data: commands[command].json})
                        .then(res => logger.info(res))
                        .catch(err => logger.error(err));
                }
            }

            res.forEach(async command => {
                if (commands[command.name.match(/^\d/) ? '_' + command.name : command.name] === undefined) {
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
