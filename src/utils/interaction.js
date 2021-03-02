module.exports = class Interaction {
    /**
     * Represents an interaction object
     * @param {import('../../types').Interaction} interaction
     * @param {import('discord.js').Client} client
     * @param {import('../../types').Utils} utils
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
     * Sends a message in response to an interaction
     * Flags allows the message to be ephemeral
     * Type is for the different kinds of interaction responses
     * @param {any} content
     * @param {type: number, flags: number} options
     */
    async send(content, options = {type: 4, flags: 0}) {
        try {
            await this.client.api
                .interactions(this.id)(this.token)
                .callback
                .post({
                    data: {
                        type: options.type,
                        data: {
                            content: content, 
                            flags: options.flags
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
     * @param {type: number, flags: number} options
     */
    async embed(embeds, options = {type: 4}) {
        try {
            await this.client.api
                .interactions(this.id)(this.token)
                .callback
                .post({
                    data: {
                        type: options.type,
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
                .webhooks((await this.client.fetchApplication()).id)(this.token)
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
                .webhooks((await this.client.fetchApplication()).id)(this.token)
                .messages('@original')
                .delete();

        } catch (err) {
            this.utils.logger.error(err);
        }
    }

    /**
     * Logs an error and sends it as an ephemeral message
     * @param {Error} err 
     * @param {type: number, flags: number} options 
     */
    async error(err, options = {type: 3, flags: 64}) {
        try {
            this.utils.logger.error(err);
            await this.client.api
                .interactions(this.id)(this.token)
                .callback
                .post({
                    data: {
                        type: options.type,
                        data: {
                            content: `${this.utils.constants.emojis.redX} ${err.name}: \`${err.message}\``,
                            flags: options.flags
                        }
                    }
                });

        } catch (err) {
            this.utils.logger.error(err);
        }
    }
};
