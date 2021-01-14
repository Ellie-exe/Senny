module.exports = {
    name: 'remind',
    async execute(i) {
        const author = i.client.users.cache.get(i.user.id);
        const place = i.data.options[0].value;
        const type = i.data.options[1].value;
        const time = i.data.options[2].value;
        const reminder = i.data.options[3].value;

        let channel;
        let displayPlace;
        let timeout;
        let displayTime;

        switch (place) {
            case 'here':
                channel = i.client.channels.cache.get(i.channel_id);
                displayPlace = channel;
                break;

            case 'me':
                channel = await author.createDM();
                displayPlace = 'you';
                break;
        }

        switch (type) {
            case 'date':
                timeout = Date.parse(time) - Date.now();
                displayTime = `at: \`${time}\``;
                break;

            case 'duration':
                const duration = time.split(' ');

                let years = 0;
                let months = 0;
                let weeks = 0;
                let days = 0;
                let hours = 0;
                let minutes = 0;
                let seconds = 0;

                for (let j = 0; j < duration.length; j++) {
                    switch (duration[j]) {
                        case 'year':
                            years = duration[j - 1] * 365 * 24 * 60 * 60 * 1000;
                            break;
                                
                        case 'years':
                            years = duration[j - 1] * 365 * 24 * 60 * 60 * 1000;
                            break;

                        case 'month':
                            months = duration[j - 1] * 30 * 24 * 60 * 60 * 1000;
                            break;

                        case 'months':
                            months = duration[j - 1] * 30 * 24 * 60 * 60 * 1000;
                            break;

                        case 'week':
                            weeks = duration[j - 1] * 7 * 24 * 60 * 60 * 1000;
                            break;

                        case 'weeks':
                            weeks = duration[j - 1] * 7 * 24 * 60 * 60 * 1000;
                            break;

                        case 'day':
                            days = duration[j - 1] * 24 * 60 * 60 * 1000;
                            break;

                        case 'days':
                            days = duration[j - 1] * 24 * 60 * 60 * 1000;
                            break;

                        case 'hour':
                            hours = duration[j - 1] * 60 * 60 * 1000;
                            break;

                        case 'hours':
                            hours = duration[j - 1] * 60 * 60 * 1000;
                            break;

                        case 'minute':
                            minutes = duration[j - 1] * 60 * 1000;
                            break;

                        case 'minutes':
                            minutes = duration[j - 1] * 60 * 1000;
                            break;

                        case 'second':
                            seconds = duration[j - 1] * 1000;
                            break;

                        case 'seconds':
                            seconds = duration[j - 1] * 1000;
                            break;

                        case 'and':
                            break;

                        default:
                            if (duration[j].endsWith('y'))
                                years = duration[j].substring(0, duration[j].length - 1) * 365 * 24 * 60 * 60 * 1000;
                                    
                            else if (duration[j].endsWith('mo'))
                                months = duration[j].substring(0, duration[j].length - 2) * 30 * 24 * 60 * 60 * 1000;
                                    
                            else if (duration[j].endsWith('w'))
                                weeks = duration[j].substring(0, duration[j].length - 1) * 7 * 24 * 60 * 60 * 1000;
                                    
                            else if (duration[j].endsWith('d'))
                                days = duration[j].substring(0, duration[j].length - 1) * 24 * 60 * 60 * 1000;
                                    
                            else if (duration[j].endsWith('h'))
                                hours = duration[j].substring(0, duration[j].length - 1) * 60 * 60 * 1000;
                                    
                            else if (duration[j].endsWith('m'))
                                minutes = duration[j].substring(0, duration[j].length - 1) * 60 * 1000;
                                    
                            else if (duration[j].endsWith('s'))
                                seconds = duration[j].substring(0, duration[j].length - 1) * 1000;
                    }
                }

                timeout = years + months + weeks + days + hours + minutes + seconds;
                displayTime = `in: \`${time}\``;
                break;
        }

        if (isNaN(timeout)) {
            i.send(`<:red_x:717257458657263679> Error: \`InputError: Invalid Time\``, 3, 64);

        } else {
            i.send(`Okay, I'll remind ${displayPlace} about: \`${reminder}\` ${displayTime}`);
            
            setTimeout(() => {
                channel.send(`Hello ${author.toString()}! You asked me to remind you about: \`${reminder}\``);
                        
            }, timeout);
        }
    }
};