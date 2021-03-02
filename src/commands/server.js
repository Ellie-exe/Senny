const { MessageEmbed } = require('discord.js');
const dateFormat = require('dateformat');
/**
 * Displays server information
 * @param {import('../../types').Interaction} command
 */
module.exports.execute = async (command) => {
    try {
        const guild = command.client.guilds.cache.get(command.guildID); // The guild the command was run in
        const options = {format: 'png', dynamic: true, size: 4096}; // Image URL options

        // Map raw names to formatted ones
        const notificationNames = {
            ALL: 'All Messages',
            MENTIONS: 'Only @mentions'
        };

        // Map raw names to formatted ones
        const verificationNames = {
            NONE: 'None',
            LOW: 'Low',
            MEDIUM: 'Medium',
            HIGH: 'High',
            VERY_HIGH: 'Highest'
        };

        // Map raw names to formatted ones
        const filterNames = {
            DISABLED: 'Don\'t scan any media content.',
            MEMBERS_WITHOUT_ROLES: 'Scan media content from members without a role.',
            ALL_MEMBERS: 'Scan media content from all members.'
        };

        // Default all counters
        let totalChannels = 0;
        let textChannels = 0;
        let voiceChannels = 0;
        let categoryChannels = 0;
        let announcementChannels = 0;
        let storeChannels = 0;

        // For every channel in the guild
        guild.channels.cache.forEach(channel => {
            // Check the channel's type
            switch (channel.type) {
                // If it's a text channel, incriment that counter
                case 'text':
                    textChannels++;
                    totalChannels++;
                    break;

                // If it's a voice channel, incriment that counter
                case 'voice':
                    voiceChannels++;
                    totalChannels++;
                    break;

                // If it's a category channel, incriment that counter
                case 'category':
                    categoryChannels++;
                    totalChannels++;
                    break;

                // If it's a news channel, incriment that counter
                case 'news':
                    announcementChannels++;
                    totalChannels++;
                    break;

                // If it's a store channel, incriment that counter
                case 'store':
                    storeChannels++;
                    totalChannels++;
                    break;
            }
        });

        // Default all counters
        let onlineMembers = 0;
        let idleMembers = 0;
        let dndMembers = 0;
        let offlineMembers = 0;
        let numMembers = 0;
        let numBots = 0;

        // For every member in the guild
        guild.members.cache.array().forEach(member => {
            // Check the member's status
            switch (member.user.presence.status) {
                // If they're online, incriment that counter
                case 'online':
                    onlineMembers++;
                    break;

                // If they're idle, incriment that counter
                case 'idle':
                    idleMembers++;
                    break;

                // If they're do not desturb, incriment that counter
                case 'dnd':
                    dndMembers++;
                    break;

                // If they're offline, incriment that counter
                case 'offline':
                    offlineMembers++;
                    break;
            }

            // Check if the member is a bot
            switch (member.user.bot) {
                // If they are not a bot
                case false:
                    // Incriment the member counter
                    numMembers++;
                    break;

                // If they are a bot
                case true:
                    // Incriment the bot counter
                    numBots++;
                    break;
            }
        });

        // Map raw names to formatted ones
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

        let features = []; // List of the guild's features

        // For every feature the guild has, format it and add it to the list
        guild.features.length === 0 ? features.push('None') : guild.features.forEach(f => features.push(featrueNames[f]));

        // Get the guild's icon, if no icon is set then use the discord icon
        const icon = guild.iconURL(options) || 'https://ellie.is.gay/1eUNml2tV';

        // Create the main embed without images
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

        let embeds = [embed1]; // List of embeds to send

        // If the guild has both a banner and a splash
        if (guild.splashURL() !== null && guild.bannerURL() !== null) {
            // Add the splash to the first embed
            embed1.setImage(guild.splashURL(options));

            // Create a new embed with the same url
            const embed2 = new MessageEmbed()
                .setURL('https://ellie.is.gay')
                .setImage(guild.bannerURL(options));

            // Add new embed to the list
            embeds.push(embed2);

        // If the guild has either a banner or a splash
        } else if (guild.splashURL() !== null || guild.bannerURL() !== null) {
            // Add the banner or splash to the embed
            embed1.setImage(guild.splashURL(options) || guild.bannerURL(options));
        }

        // Send the embeds, because both embeds have the same url the two images will be in one embed
        // This is possible because under the hood slash commands are webhooks
        command.embed(embeds);

    } catch (err) {
        // Log any errors
        command.error(err);
    }
};
