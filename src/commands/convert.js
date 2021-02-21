/**
 * @param {import('../../types').Interaction} command
 */
module.exports.execute = async (command) => {
    try {
        const value = command.data.options[0].value;
        const unit = command.data.options[1].value;

        let conversion;
        let units;

        switch (unit) {
            case 'fahrenheit':
                conversion = `${Math.round((value - 32) * 5 / 9)}°C`;
                units = '°F';
                break;

            case 'celsius':
                conversion = `${Math.round((value * 9/5) + 32)}°F`;
                units = '°C';
                break;

            case 'inches':
                conversion = `${Math.round(value * 2.54)} cm`;
                units = ' in';
                break;

            case 'centimeters':
                conversion = `${Math.round(value / 2.54)} in`;
                units = ' cm'
                break;
        }

        command.send(`\`${value}${units}\` is \`${conversion}\``);

    } catch (err) {
        command.error(err);
    }
};