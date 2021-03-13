/**
 * Convert values between imperial and metric
 * @param {import('../utils').Interaction} command
 */
module.exports.execute = async (command) => {
    try {
        const value = command.data.options[0].value; // The value to convert
        const unit = command.data.options[1].value; // The unit to convert from

        let conversion; // The output conversion
        let units; // The formatted unit that the output was converted from

        // Check the unit to convert from and convert each value accordingly
        switch (unit) {
            // Fahrenheit to celsius
            case 'fahrenheit':
                conversion = `${Math.round((value - 32) * 5 / 9)}°C`;
                units = '°F';
                break;

            // Celsius to fahrenheit
            case 'celsius':
                conversion = `${Math.round((value * 9/5) + 32)}°F`;
                units = '°C';
                break;

            // Inches to centimeters
            case 'inches':
                conversion = `${Math.round(value * 2.54)} cm`;
                units = ' in';
                break;

            // Centimeters to inches
            case 'centimeters':
                conversion = `${Math.round(value / 2.54)} in`;
                units = ' cm'
                break;
        }

        // Send the conversion
        command.send(`\`${value}${units}\` is \`${conversion}\``);

    } catch (err) {
        // Log any errors
        command.error(err);
    }
};
