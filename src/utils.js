const { createLogger, format, transports } = require('winston');
const { combine, timestamp, colorize, printf } = format;
const mongoose = require('mongoose');
const { Schema } = mongoose;

try {
    const myFormat = printf(({level, message, timestamp}) => {
        return `${timestamp} [ ${level} ] ${message}`;
    });

    const logger = createLogger({
        level: 'debug',
        format: combine(
            timestamp({format: 'YYYY/MM/DD HH:mm:ss'}),
            colorize({colors: {info: 'cyan', error: 'red', warn: 'yellow', debug: 'gray'}}),
            myFormat
        ),
        transports: [
            new transports.Console(),
            new transports.File({
                filename: 'events/events.log',
                level: 'debug'
            })
        ]
    });

    const accountSchema = new Schema({
        userId: String,
        balance: Number,
    });

    const birthdaySchema = new Schema({
        userId: String,
        month: Number,
        day: Number,
    });

    const reminderSchema = new Schema({
        authorString: String,
        destinationString: String,
        message: String,
        authorId: String,
        destinationId: String,
        startTimestamp: Number,
        endTimestamp: Number,
        id: String,
    });

    const accounts = mongoose.model('accounts', accountSchema);
    const birthdays = mongoose.model('birthdays', birthdaySchema);
    const reminders = mongoose.model('reminders', reminderSchema);

    module.exports = {logger, accounts, birthdays, reminders};

} catch (err) {
    console.error(err.stack);
}
