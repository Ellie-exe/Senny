/**
 * @param {import('../../types').Client} client 
 * @param {import('../../types').Utils} utils 
 */
module.exports = async (client, utils) => {
    try {
        let counter = -1;
        
        setInterval(async () => {
            (counter === 3) ? counter = 0 : counter++;

            const activity = [
                {type: 'LISTENING', name: '/'},
                {type: 'WATCHING', name: 'over Bongo'},
                {type: 'PLAYING', name: 'with the API'},
                {type: 'WATCHING', name: `${client.guilds.cache.array().length} Guilds`}
            ];

            client.user.setActivity(activity[counter].name, {type: activity[counter].type});
        
        }, 30000);

        utils.logger.info(`Bot ready in ${client.guilds.cache.array().length} guilds`);

    } catch (err) {
        utils.logger.error(err);
    }
}