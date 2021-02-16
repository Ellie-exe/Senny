const { MessageEmbed } = require('discord.js');
const dateFormat = require('dateformat');
/**
 * @param {import('../../types').Interaction} command
 * @param {import('../../types').Utils} utils
 */
module.exports.execute = async (command, utils) => {
    try {
        const guild = command.client.guilds.cache.get(command.guildID);
        const options = {format: 'png', dynamic: true, size: 4096};

        const notificationNames = {
            ALL: 'All Messages',
            MENTIONS: 'Only @mentions'
        };

        const verificationNames = {
            NONE: 'None',
            LOW: 'Low',
            MEDIUM: 'Medium',
            HIGH: 'High',
            VERY_HIGH: 'Highest'
        };

        const filterNames = {
            DISABLED: 'Don\'t scan any media content.',
            MEMBERS_WITHOUT_ROLES: 'Scan media content from members without a role.',
            ALL_MEMBERS: 'Scan media content from all members.'
        };

        let totalChannels = 0;
        let textChannels = 0;
        let voiceChannels = 0;
        let categoryChannels = 0;
        let announcementChannels = 0;
        let storeChannels = 0;

        guild.channels.cache.forEach(channel => {
            switch (channel.type) {
                case 'text':
                    textChannels++;
                    totalChannels++;
                    break;
                        
                case 'voice':
                    voiceChannels++;
                    totalChannels++;
                    break;
                        
                case 'category':
                    categoryChannels++;
                    totalChannels++;
                    break;

                case 'news':
                    announcementChannels++;
                    totalChannels++;
                    break;
                        
                case 'store':
                    storeChannels++;
                    totalChannels++;
                    break;
            }
        });

        let onlineMembers = 0;
        let idleMembers = 0;
        let dndMembers = 0;
        let offlineMembers = 0;
        let numMembers = 0;
        let numBots = 0;

        guild.members.cache.array().forEach(member => {
            switch (member.user.presence.status) {
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
            }

            switch (member.user.bot) {
                case false:
                    numMembers++;
                    break;

                case true:
                    numBots++;
                    break;
            }
        });
        
        const featrueNames = {
            ANIMATED_ICON: 'Animated Icon',
            BANNER: 'Banner',
            COMMERCE: 'Commerce',
            COMMUNITY: 'Community',
            DISCOVERABLE: 'Discoverable',
            FEATURABLE: 'Featurable',
            INVITE_SPLASH: 'Invite Splash',
            NEWS: 'News',
            PARTNERED: 'Partnered',
            RELAY_ENABLED: 'Relay Enabled',
            VANITY_URL: 'Vanity URL',
            VERIFIED: 'Verified',
            VIP_REGIONS: 'VIP Regions',
            WELCOME_SCREEN_ENABLED: 'Welcome Screen Enabled',
            PREVIEW_ENABLED: 'Preview Enabled',
            ENABLED_DISCOVERABLE_BEFORE: 'Enabled Discoverable Before',
            MEMBER_VERIFICATION_GATE_ENABLED: 'Member Verification Gate Enabled'
        };
                
        let features = [];
        guild.features.length === 0 ? features.push('None') : guild.features.forEach(f => features.push(featrueNames[f]));

        const icon = guild.iconURL(options) || 'https://ellie.is.gay/1eUNml2tV';
                
        const embed1 = new MessageEmbed()
            .setURL('https://ellie.is.gay')
            .setAuthor(`${guild.name} - Information`, null, icon)
            .setDescription(
                `Owner: ${guild.owner}\n`+
                `System Channel: ${guild.systemChannel || '`None`'}\n`+
                `ID: \`${guild.id}\`\n`+
                `Created: \`${dateFormat(guild.createdAt, 'mmmm d, yyyy "at" h:MM TT Z')}\`\n`+
                `Bot Joined: \`${dateFormat(guild.joinedAt, 'mmmm d, yyyy "at" h:MM TT Z')}\`\n`+
                `Region: \`${guild.region}\`\n`+
                `Partnered: \`${guild.partnered ? 'Yes' : 'No'}\`\n`+
                `Verified: \`${guild.verified ? 'Yes' : 'No'}\`\n\n`+
                `Vanity: \`${guild.vanityURLCode ? `discord.gg/${guild.vanityURLCode}` : 'None'}\`\n`+
                `Banner: ${guild.bannerURL() ? `[\`Link\`](${guild.bannerURL(options)})` : '`None`'}\n`+
                `Splash: ${guild.splashURL() ? `[\`Link\`](${guild.splashURL(options)})` : '`None`'}\n`+
                `Icon: ${guild.iconURL() ? `[\`Link\`](${guild.iconURL(options)})` : '`None`'}\n\n`+
                `Rules or Guidelines Channel: ${guild.rulesChannel || '`None`'}\n`+
                `Community Updates Channel: ${guild.publicUpdatesChannel || '`None`'}\n`+
                `Primary Language: \`${guild.preferredLocale || '`None`'}\`\n\n`+
                `Boosts: \`${guild.premiumSubscriptionCount} Boosts\`\n`+
                `Boost Level: \`Tier ${guild.premiumTier}\`\n\n`+
                `Verification Level: \`${verificationNames[guild.verificationLevel]}\`\n`+
                `Default Notifications: \`${notificationNames[guild.defaultMessageNotifications]}\`\n`+
                `Content Filter: \`${filterNames[guild.explicitContentFilter]}\`\n`+
                `2FA Requirement: \`${guild.mfaLevel ? 'On' : 'Off'}\`\n\n`+
                `Channels [\`${totalChannels} Total\`]:\n`+
                `<:text:772577583648210965> \`${textChannels} Text Channels\`\n`+
                `<:voice:772577600400392192> \`${voiceChannels} Voice Channels\`\n`+
                `<:category:772577614157709363> \`${categoryChannels} Categories\`\n`+
                `<:announcement:772577634571517952> \`${announcementChannels} Announcement Channels\`\n`+
                `<:store:794645005398048808> \`${storeChannels} Store Channels\`\n\n`+
                `<:emojis:773417353144172554> \`${guild.emojis.cache.array().length} Emojis\`\n`+
                `<:roles:773418244140171324> \`${guild.roles.cache.array().length} Roles\`\n\n`+
                `Members [\`${guild.memberCount} Total\`]:\n`+
                `<:online:718302081399783573> \`${onlineMembers} Online\`\n`+
                `<:idle:718302096096624741> \`${idleMembers} Idle\`\n`+
                `<:dnd:718302130695438346> \`${dndMembers} Busy\`\n`+
                `<:offline:718302145698594838> \`${offlineMembers} Offline\`\n\n`+
                `<:member:772872418481930282> \`${numMembers} Members\`\n`+
                `<:bot:772872483661414400> \`${numBots} Bots\`\n\n`+
                `Features: \`${features.join(', ')}\``
            )
            .setColor(process.env.color)
            .setThumbnail(icon);

        let embeds = [embed1];

        if (guild.splashURL() !== null && guild.bannerURL() !== null) {
            embed1.setImage(guild.splashURL(options));

            const embed2 = new MessageEmbed()
                .setURL('https://ellie.is.gay')
                .setImage(guild.bannerURL(options));

            embeds.push(embed2);
        
        } else if (guild.splashURL() !== null || guild.bannerURL() !== null) {
            embed1.setImage(guild.splashURL(options) || guild.bannerURL(options));
        }

        command.embed(embeds);

    } catch (err) {
        command.send(`${utils.constants.emojis.redX} ${err.name}: \`${err.message}\``, {type: 3, flags: 64});
        utils.logger.error(err);
    }
};