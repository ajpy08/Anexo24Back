import { UserEmpresa } from './userEmpresa';
import { DataTypes, Model } from 'sequelize'
import db from '../db/connection';

export interface DireccionAttributes {
    direccionId: number
    calle: string
    numero: string
    cp: string
    colonia: string,
    domicilioFiscal: boolean,
    tipo: boolean,
    estado: boolean,
    empresaId: number,
}

export interface DireccionInterface extends Model<DireccionInterface, DireccionAttributes> {
    direccionId: number,
    calle: string,
    numero: string,
    cp: string,
    colonia: string,
    domicilioFiscal: boolean,
    tipo: boolean,
    estado: boolean,
    createdAt: string,
    updatedAt: string,
    empresaId: number,
}

export interface DireccionViewModel {
    direccionId: number
    numero: string
}

export const Direccion = db.define<DireccionInterface, DireccionAttributes>('direcciones', {
    direccionId: {
        type: DataTypes.UUID,
        autoIncrement: true,
        primaryKey: true
    },
    calle: { type: DataTypes.STRING(100), allowNull: false },
    numero: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    cp: { type: DataTypes.STRING, allowNull: false },
    colonia: { type: DataTypes.STRING, allowNull: false },
    domicilioFiscal: DataTypes.BOOLEAN,
    tipo: DataTypes.BOOLEAN,
    estado: DataTypes.BOOLEAN,
    empresaId: {
        type: DataTypes.UUID
    },
});

// Direccion.belongsTo(DireccionEmpresa, {
//     foreignKey: 'direccionId',
//     // as: 'direcicon'
// });