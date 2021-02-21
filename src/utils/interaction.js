module.exports = class Interaction {
    /**
     * @param {import('../../types').Interaction} interaction
     * @param {import('../../types').Client} client
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
}
