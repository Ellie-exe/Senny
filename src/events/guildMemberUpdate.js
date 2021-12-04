module.exports = {
    name: 'guildMemberUpdate',
    /**
     * @param {import('discord.js/typings').GuildMember} oldMember
     * @param {import('discord.js/typings').GuildMember} newMember
     */
    async execute(oldMember, newMember) {
        try {
            if (newMember.guild.id !== '573272766149558272') return;

            if (oldMember.pending && !newMember.pending && !newMember.user.bot) {
                const channel = newMember.guild.channels.cache.get('573272766611193867');
                await newMember.roles.add('578211559390576640');

                const message = await channel.send(
                    `Welcome to **RedNet**! Be sure to read the rules in <#578226946786459649>, ` +
                    `grab yourself some roles in <#781959946635444255>, and introduce yourself in <#647970191090909185>! ` +
                    `If you have any questions, feel free to ask! We hope you have a great time here!\n` +
                    `https://ellie.hep.gg/welcome.gif`
                );

                await message.edit(
                    `Welcome to **RedNet**, ${newMember}! Be sure to read the rules in <#578226946786459649>, ` +
                    `grab yourself some roles in <#781959946635444255>, and introduce yourself in <#647970191090909185>! ` +
                    `If you have any questions, feel free to ask! We hope you have a great time here!\n` +
                    `https://ellie.hep.gg/welcome.gif`
                );

                for (const flag of newMember.user.flags?.toArray()) {
                    switch (flag) {
                        case 'HOUSE_BALANCE': {
                            await newMember.roles.add('582359823610544171');
                            break;
                        }

                        case 'HOUSE_BRAVERY': {
                            await newMember.roles.add('582359813992874035');
                            break;
                        }

                        case 'HOUSE_BRILLIANCE': {
                            await newMember.roles.add('582359819047010324');
                            break;
                        }

                        case 'HYPESQUAD_EVENTS': {
                            await newMember.roles.add('579840192463241241');
                            break;
                        }

                        case 'EARLY_VERIFIED_BOT_DEVELOPER': {
                            await newMember.roles.add('828680835531669544');
                            break;
                        }
                    }
                }
            }

        } catch (err) {
            logger.error(err);
        }
    }
};
