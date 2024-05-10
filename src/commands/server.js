const { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } = require('discord.js');
const { logger } = require('../utils');

module.exports = {
    guildId: 'global',
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Replies with server info!'),

    /** @param {ChatInputCommandInteraction} interaction */
    async execute(interaction) {
        try {
            await interaction.deferReply();

            const options = {format: 'png', dynamic: true, size: 4096};
            const guild = await interaction.guild.fetch();
            const owner = await guild.fetchOwner();

            const notificationNames = {
                ALL_MESSAGES: 'All Messages',
                ONLY_MENTIONS: 'Only @mentions'
            };

            const verificationNames = {
                NONE: 'None',
                LOW: 'Low',
                MEDIUM: 'Medium',
                HIGH: 'High',
                VERY_HIGH: 'Highest'
            };

            const premiumTierNames = {
                NONE: 'None',
                TIER_1: 'Tier 1',
                TIER_2: 'Tier 2',
                TIER_3: 'Tier 3'
            };

            const filterNames = {
                DISABLED: 'Don\'t scan any content',
                MEMBERS_WITHOUT_ROLES: 'Scan content from members without a role',
                ALL_MEMBERS: 'Scan content from all members'
            };

            const featureNames = {
                ANIMATED_ICON: 'Animated Icon',
                BANNER: 'Banner',
                COMMERCE: 'Commerce',
                COMMUNITY: 'Community',
                DISCOVERABLE: 'Discoverable',
                FEATURABLE: 'Featurable',
                INVITE_SPLASH: 'Invite Splash',
                NEWS: 'News',
                PARTNERED: 'Partnered',
                VANITY_URL: 'Vanity URL',
                VERIFIED: 'Verified',
                VIP_REGIONS: 'VIP Regions',
                WELCOME_SCREEN_ENABLED: 'Welcome Screen Enabled',
                TICKETED_EVENTS_ENABLED: 'Ticketed Events Enabled',
                MONETIZATION_ENABLED: 'Monetization Enabled',
                MORE_STICKERS: 'More Stickers',
                THREE_DAY_ARCHIVE: '3 Day Archive',
                SEVEN_DAY_ARCHIVE: '1 Week Archive',
                PRIVATE_THREADS: 'Private Threads',
                ROLE_ICONS: 'Role Icons',
                PREVIEW_ENABLED: 'Preview Enabled',
                ENABLED_DISCOVERABLE_BEFORE: 'Enabled Discoverable Before',
                MEMBER_VERIFICATION_GATE_ENABLED: 'Member Verification Gate Enabled'
            };

            let features = [];
            guild.features.forEach(f => {
                if (featureNames[f]) features.push(featureNames[f])
            });

            let totalChannels = 0;
            let textChannels = 0;
            let voiceChannels = 0;
            let stageChannels = 0;
            let categoryChannels = 0;
            let announcementChannels = 0;
            let storeChannels = 0;

            guild.channels.cache.each(channel => {
                switch (channel.type) {
                    case 'GUILD_TEXT':
                        textChannels++;
                        totalChannels++;
                        break;

                    case 'GUILD_VOICE':
                        voiceChannels++;
                        totalChannels++;
                        break;

                    case 'GUILD_STAGE_VOICE':
                        stageChannels++;
                        totalChannels++;
                        break;

                    case 'GUILD_CATEGORY':
                        categoryChannels++;
                        totalChannels++;
                        break;

                    case 'GUILD_NEWS':
                        announcementChannels++;
                        totalChannels++;
                        break;

                    case 'GUILD_STORE':
                        storeChannels++;
                        totalChannels++;
                        break;
                }
            });

            let onlineMembers = 0;
            let idleMembers = 0;
            let dndMembers = 0;
            let offlineMembers = 0;
            let numHumans = 0;
            let numBots = 0;

            guild.members.cache.each(member => {
                switch (member.presence?.status) {
                    case 'online':
                        onlineMembers++;
                        break;

                    case 'idle':
                        idleMembers++;
                        break;

                    case 'dnd':
                        dndMembers++;
                        break;

                    case 'offline':
                        offlineMembers++;
                        break;

                    default:
                        offlineMembers++;
                }

                switch (member.user.bot) {
                    case false:
                        numHumans++;
                        break;

                    case true:
                        numBots++;
                        break;
                }
            });

            const embed = new EmbedBuilder()
                .setThumbnail(guild.iconURL({dynamic: true}) || 'https://ellie.hep.gg/jtW0IuJWR')
                .setImage(guild.bannerURL({size: 4096}) || guild.splashURL({size: 4096}))
                .setAuthor({
                    name: `${guild.name}`,
                    iconURL: guild.iconURL({dynamic: true}) || 'https://ellie.hep.gg/jtW0IuJWR'
                })
                .setColor(0x2F3136)
                .addFields(
                    {
                        name: 'About',
                        value: `Owner: ${owner.toString()}\n` +
                            `Created: <t:${Math.round(guild.createdTimestamp / 1000)}:R>\n` +
                            `Primary Language: **${guild.preferredLocale}**\n` +
                            `Default Notifications: **${notificationNames[guild.defaultMessageNotifications]}**\n` +
                            `Content Filter: **${filterNames[guild.explicitContentFilter]}**\n` +
                            `Verification Level: **${verificationNames[guild.verificationLevel]}**\n` +
                            `2FA Requirement: **${guild.mfaLevel === 'ELEVATED' ? 'On' : 'Off'}**\n` +
                            `Boost Level: **${premiumTierNames[guild.premiumTier]}**\n` +
                            `Boosts: **${guild.premiumSubscriptionCount} Boosts**\n` +
                            `Partnered: **${guild.partnered ? 'Yes' : 'No'}**\n` +
                            `Verified: **${guild.verified ? 'Yes' : 'No'}**\n` +
                            `Vanity: **${guild.vanityURLCode || 'None'}**`
                    },
                    {
                        name: 'Links',
                        value: `Banner: **${guild.bannerURL() ? `[Link](${guild.bannerURL(options)})` : 'None'}**\n` +
                            `Splash: **${guild.splashURL() ? `[Link](${guild.splashURL(options)})` : 'None'}**\n` +
                            `Icon: **${guild.iconURL() ? `[Link](${guild.iconURL(options)})` : 'None'}**`
                    },
                    {
                        name: `Channels [\`${totalChannels}\`]`,
                        value: `<:text:908800033057546291> \`${textChannels}\` Text Channels\n` +
                            `<:voice:908800107003125781> \`${voiceChannels}\` Voice Channels\n` +
                            `<:stage:908805658835550249> \`${stageChannels}\` Stage Channels\n` +
                            `<:category:908800137143418941> \`${categoryChannels}\` Categories\n` +
                            `<:announcement:908800175089278996> \`${announcementChannels}\` Announcement Channels\n` +
                            `<:store:908800246161735680> \`${storeChannels}\` Store Channels\n` +
                            `<:emoji:908800355226222603> \`${guild.emojis.cache.size}\` Emojis\n` +
                            `<:sticker:908800325031436308> \`${guild.stickers.cache.size}\` Stickers\n` +
                            `<:role:908800286632579103> \`${guild.roles.cache.size}\` Roles`
                    },
                    {
                        name: `Members [\`${guild.memberCount}\`]`,
                        value: `<:online:718302081399783573> \`${onlineMembers}\` Online\n` +
                            `<:idle:718302096096624741> \`${idleMembers}\` Idle\n` +
                            `<:dnd:718302130695438346> \`${dndMembers}\` Busy\n` +
                            `<:offline:718302145698594838> \`${offlineMembers}\` Offline\n` +
                            `<:member:772872418481930282> \`${numHumans}\` Humans\n` +
                            `<:bot:772872483661414400> \`${numBots}\` Bots`
                    },
                    {
                        name: 'Features',
                        value: `${features.length ? features.join(', ') : 'None'}`
                    });

            await interaction.editReply({embeds: [embed]});

        } catch (err) {
            logger.error(err);
        }
    }
};
