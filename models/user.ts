import { UserEmpresa } from './userEmpresa';
import { DataTypes, Model } from 'sequelize'
import db from '../db/connection';

export interface UserAttributes {
    userId: number
    nombre: string
    email: string
    password: string
    estado: boolean
}

export interface UserModel extends Model<UserModel, UserAttributes> {
    userId: number
    nombre: string
    email: string
    password: string
    estado: boolean
    createdAt: string
    updatedAt: string
}

export interface UserViewModel {
    userId: number
    email: string
}

export const User = db.define<UserModel, UserAttributes>('user', {
    userId: {
        type: DataTypes.UUID,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    estado: DataTypes.BOOLEAN
});

User.belongsTo(UserEmpresa, {
    foreignKey: 'userId',
    // as: 'user'
});