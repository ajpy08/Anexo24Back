import { Sequelize } from 'sequelize';
import config from '../config/config.json';
import { Empresa } from '../models/empresa';
import { User } from '../models/user';

const db = new Sequelize(config.db.DATABASE_NAME, config.db.DATABASE_USER, config.db.DATABASE_PASSWORD, {
    host: config.db.DATABASE_HOST,
    dialect: 'mysql',
    logging: true, // default true
    port: config.db.DATABASE_PORT,
});

// Empresa.belongsToMany(User, {
//     through: "user_empresa",
//     as: "users",
//     foreignKey: "empresa_id",
// });

// User.belongsToMany(Empresa, {
//     through: "user_empresa",
//     as: "empresas",
//     foreignKey: "user_id",
// });

export default db;