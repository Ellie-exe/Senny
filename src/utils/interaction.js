module.exports = class Interaction {
    /**
     * @param {import('../utils').Interaction} interaction
     * @param {import('discord.js').Client} client
     * @param {import('../utils')} utils
     */
    constructor(interaction, client, utils) {
        this.token = interaction.token;
        this.member = interaction.member;
        this.user = interaction.member.user;
        this.id = interaction.id;
        this.guildID = interaction.guild_id;
        this.data = interaction.data;
        this.channelID = interaction.channel_id;
        this.authorID = interaction.member.user.id;
        this.userID = interaction.member.user.id;
        this.command = interaction.data.name;
        this.args = interaction.data.options;
        this.client = client;
        this.utils = utils;
    }

    /**
     * @param {number} flags 
     */
    async defer(flags = 0) {
        try {
            await this.client.api
                .interactions(this.id)(this.token)
                .callback
                .post({
                    data: {
                        type: 5,
                        data: {
                            flags: flags
                        }
                    }
                });

        } catch (err) {
            this.utils.logger.error(err);
        }
    }

    /**
     * @param {any} content
     * @param {number} flags
     */
    async send(content, flags = 0) {
        try {
            await this.client.api
                .interactions(this.id)(this.token)
                .callback
                .post({
                    data: {
                        type: 4,
                        data: {
                            content: content, 
                            flags: flags
                        }
                    }
                });

        } catch (err) {
            this.utils.logger.error(err);
        }
    }

    /**
     * @param {any} content
     */
    async embed(embeds) {
        try {
            await this.client.api
                .interactions(this.id)(this.token)
                .callback
                .post({
                    data: {
                        type: 4,
                        data: {
                            embeds: embeds
                        }
                    }
                });

        } catch (err) {
            this.utils.logger.error(err);
        }
    }

    /**
     * @param {any} content 
     */
    async edit(content) {
        try {
            await this.client.api
                .webhooks(this.client.user.id)(this.token)
                .messages('@original')
                .patch({
                    data: {
                        content: content
                    }
                });

        } catch (err) {
            this.utils.logger.error(err);
        }
    }

     async messageID() {
        try {
            const message = await this.client.api
                .webhooks(this.client.user.id)(this.token)
                .messages('@original')
                .patch({data: {}});

            return message.id;

        } catch (err) {
            this.utils.logger.error(err);
        }
    }

    async delete() {
        try {
            await this.client.api
                .webhooks(this.client.user.id)(this.token)
                .messages('@original')
                .delete();

        } catch (err) {
            this.utils.logger.error(err);
        }
    }

    /**
     * @param {Error} err 
     * @param {number} flags 
     */
    async error(err, flags = 64) {
        try {
            this.utils.logger.error(err);
            await this.client.api
                .interactions(this.id)(this.token)
                .callback
                .post({
                    data: {
                        type: 4,
                        data: {
                            content: `${this.utils.constants.emojis.redX} ${err.name}: \`${err.message}\``,
                            flags: flags
                        }
                    }
                });

        } catch (err) {
            this.utils.logger.error(err);
        }
    }
};
