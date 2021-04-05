const logger = require('@jakeyprime/logger');
const mariadb = require('mariadb');

module.exports = class Database {
    constructor() {
        this.sql = '';
        this.val = [];
    }

    select(column) {
        this.sql = `SELECT ${column}`;
        return this;
    }

    from(table) {
        this.sql = this.sql + ` FROM ${table}`;
        return this;
    }

    where(row, value) {
        this.val.push(value);
        this.sql = this.sql + ` WHERE ${row}=(?)`;
        return this;
    }

    insert(table) {
        this.sql = `INSERT INTO ${table}`;
        return this;
    }

    delete(table) {
        this.sql = `DELETE FROM ${table}`;
        return this;
    }

    values(...values) {
        values.forEach(value => this.val.push(value));

        let placeholders = [];
        for (let i = 0; i < values.length; i++) {
            placeholders.push('?');
        }

        this.sql = this.sql + ` VALUES (${placeholders.join(', ')})`;

        return this;
    }

    onDupe(values = {}) {
        let placeholders = [];

        for (const [key, value] of Object.entries(values)) {
            placeholders.push(`${key}=(?)`);
            this.val.push(value);
        }

        this.sql = this.sql + ` ON DUPLICATE KEY UPDATE ${placeholders.join(', ')}`;
        return this;
    }

    async query(callback = async (err, res) => {}) {
        try {
            const conn = await mariadb.createConnection({
                user: process.env.user,
                password: process.env.password,
                database: process.env.database
            });

            const res = await conn.query(this.sql, this.val);
            await conn.end();

            await callback(null, res);
        
        } catch (err) {
            await callback(err);
        }
    }

    async error(err) {
        logger.error(err);
        throw new Error('Database Error');
    }
};
