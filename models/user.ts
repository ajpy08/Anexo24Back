// import * as Sequelize from 'sequelize'
import { DataTypes, Model } from 'sequelize'
import db from '../db/connection';

export interface UserAddModel {
    id: number
    nombre: string
    email: string
    password: string
    estado: boolean
}

export interface UserModel extends Model<UserModel, UserAddModel> {
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

export const User = db.define<UserModel, UserAddModel>('user', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    estado: DataTypes.BOOLEAN
})