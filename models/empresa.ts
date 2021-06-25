import { DataTypes, Model } from 'sequelize'
import db from '../db/connection';
import { User } from './user';
import { UserEmpresa } from './userEmpresa';

export interface EmpresaAttributes {
    empresaId: number
    rfc: string
    nombre: string,
    immex: string,
    estado: boolean
}

export interface EmpresaInterface extends Model<EmpresaInterface, EmpresaAttributes> {
    empresaId: number
    rfc: string
    nombre: string,
    immex: string,
    estado: boolean
    createdAt: string
    updatedAt: string
}

export const Empresa = db.define<EmpresaInterface, EmpresaAttributes>('empresa', {
    empresaId: {
        type: DataTypes.UUID,
        autoIncrement: true,
        primaryKey: true
    },
    rfc: DataTypes.STRING(13),
    nombre: DataTypes.STRING,
    immex: DataTypes.STRING,
    estado: DataTypes.BOOLEAN
});

// Empresa.belongsTo(UserEmpresa, {
//     foreignKey: 'empresaId',
//     // as: 'user'
// });