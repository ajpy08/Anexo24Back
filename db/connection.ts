import {Sequelize} from 'sequelize';
import config from '../config/config.json';

const db = new Sequelize(config.db.DATABASE_NAME, config.db.DATABASE_USER, config.db.DATABASE_PASSWORD, {
    host: config.db.DATABASE_HOST,
    dialect: 'mysql',
    // logging: false,
    port: config.db.DATABASE_PORT
});

export default db;