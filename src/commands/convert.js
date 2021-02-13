/**
 * @param {import('../types').Interaction} command
 * @param {import('../types').Utils} utils
 */
module.exports.execute = async (command, utils) => {
    try {
        const unit = command.data.options[0].value;
        const value = command.data.options[1].value;

        switch (unit) {
            case 'fahrenheit':
                var conversion = `${Math.round((value - 32) * 5 / 9)}°C`;
                var units = '°F';
                break;

            case 'celsius':
                var conversion = `${Math.round((value * 9/5) + 32)}°F`;
                var units = '°C';
                break;

            case 'inches':
                var conversion = `${Math.round(value * 2.54)} cm`;
                var units = ' in';
                break;

            case 'centimeters':
                var conversion = `${Math.round(value / 2.54)} in`;
                var units = ' cm'
                break;
        }

        command.send(`Input: \`${value}${units}\`\nOutput: \`${conversion}\``);

    } catch (err) {
        command.send(`${utils.constants.emojis.redX} Error: \`${err}\``, {type: 3, flags: 64});
        utils.logger.error(err);
    }
};