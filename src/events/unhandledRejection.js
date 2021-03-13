/**
 * Fires whenever a nodejs error gets thrown
 * This is just so all errors run through logger
 * @param {Error} err
 * @param {import('../utils')} utils
 */
module.exports = async (err, utils) => {
    utils.logger.error(err);
};
