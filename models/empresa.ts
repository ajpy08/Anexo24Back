import { DataTypes, Model } from 'sequelize'
import db from '../db/connection';
import { User } from './user';

export interface EmpresaAttributes {
    id: number
    rfc: string
    nombre: string
    estado: boolean
}


export interface EmpresaInterface extends Model<EmpresaInterface, EmpresaAttributes> {
    id: number
    rfc: string
    nombre: string
    estado: boolean
    createdAt: string
    updatedAt: string
}

export const Empresa = db.define<EmpresaInterface, EmpresaAttributes>('empresa', {
    id: {
        type: DataTypes.UUID,
        autoIncrement: true,
        primaryKey: true
    },
    rfc: DataTypes.STRING(13),
    nombre: DataTypes.STRING,
    estado: DataTypes.BOOLEAN
});

// Empresa.belongsToMany(User, {
//     through: "user_empresa",
//     as: "users",
//     foreignKey: "empresa_id",
//   });