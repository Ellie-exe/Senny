/**
 * Fires whenever a shard error gets thrown
 * @param {Error} err
 * @param {import('../../types').Utils} utils
 */
module.exports = async (err, utils) => {
    utils.logger.error(err);
};
