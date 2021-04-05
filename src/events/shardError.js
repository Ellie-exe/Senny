/**
 * @param {Error} err
 * @param {import('../utils')} utils
 */
module.exports = async (err, utils) => {
    utils.logger.error(err);
};
