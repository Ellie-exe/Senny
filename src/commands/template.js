module.exports = {
    /**
     * @param {import('../utils').Interaction} command
     * @param {import('../utils')} utils
     */
    async execute(command, utils) {
        try {

        } catch (err) {
            await command.error(err);
        }
    },

    data: {
        name: '',
        description: '',
        options: []
    }
};
