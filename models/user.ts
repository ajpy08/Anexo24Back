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

export interface UserInterface extends Model<UserInterface, UserAttributes> {
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

export const User = db.define<UserInterface, UserAttributes>('user', {
    userId: {
        type: DataTypes.UUID,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    password: { type: DataTypes.STRING(150), allowNull: false },
    estado: DataTypes.BOOLEAN
});

User.belongsTo(UserEmpresa, {
    foreignKey: 'userId',
    // as: 'user'
});