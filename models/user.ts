import { Empresa } from './empresa';
// import * as Sequelize from 'sequelize'
import { DataTypes, DateDataType, Model } from 'sequelize'
import db from '../db/connection';

export interface UserAttributes {
    id: number
    nombre: string
    email: string
    password: string
    estado: boolean
}

export interface UserModel extends Model<UserModel, UserAttributes> {
    id: number
    nombre: string
    email: string
    password: string
    estado: boolean
    createdAt: string
    updatedAt: string
}

export interface UserViewModel {
    id: number
    email: string
}

export const User = db.define<UserModel, UserAttributes>('user', {
    id: {
        type: DataTypes.UUID,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    estado: DataTypes.BOOLEAN
});

// User.hasMany(Empresa);
// Empresa.belongsTo(User, {foreignKey: 'idUser', targetKey: 'id'});

User.belongsToMany(Empresa, {
    through: "user_empresa",
    as: "empresas",
    foreignKey: "idUser",
});