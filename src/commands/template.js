module.exports = {
    /** @param {import('discord.js/typings').CommandInteraction} command */
    async execute(command) {
        try {
            // Code here

        } catch (err) {
            logger.error(err);
        }
    },

    data: [
        {
            type: '',
            name: '',
            description: '',
            defaultPermission: true,
            options: [
                {
                    type: '',
                    name: '',
                    description: '',
                    required: true,
                    choices: [
                        {
                            name: '',
                            value: ''
                        }
                    ]
                }
            ]
        }
    ],

    flags: {
        developer: false
    }
};
