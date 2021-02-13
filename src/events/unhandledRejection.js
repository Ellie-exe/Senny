/**
 * @param {import('../../types').error} err
 * @param {import('../../types').Utils} utils 
 */
module.exports = async (err, utils) => {
    utils.logger.error(err);
}