module.exports = class Interaction {
    /**
     * Represents an interaction object
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
        this.client = client;
        this.utils = utils;
    }

    /**
     * ACKs the ping while deferring the response
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
     * Sends a message in response to an interaction
     * Flags allows the message to be ephemeral
     * Type is for the different kinds of interaction responses
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
     * Sends an embed or set of embeds in response to an interaction
     * Type is for the different kinds of interaction responses
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
     * Edits an interaction response with new content
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

    /**
     * Deletes an interaction response
     */
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
     * Logs an error and sends it as an ephemeral message
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
