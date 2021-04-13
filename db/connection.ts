import {Sequelize} from 'sequelize';

const db = new Sequelize('anexo24', 'root', 'fmat*0348', {
    host: 'localhost',
    dialect: 'mysql',
    // logging: false,
    port: 3307
});

export default db;