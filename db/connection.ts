import { Sequelize } from 'sequelize';
import config from '../config/config.json';

const db = new Sequelize(process.env.DATABASE_NAME as string, process.env.DATABASE_USER as string,  process.env.DATABASE_PASSWORD, {
    host: process.env.DATABASE_HOST,
    dialect: 'mysql',
    logging: console.log,
    port: parseInt(process.env.DATABASE_PORT as string, 10) || 3000,
});

export default db;