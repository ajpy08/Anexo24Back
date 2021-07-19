import { DataTypes, Model } from 'sequelize'
import db from '../db/connection';

export interface EntidadAttributes {
    entidadId: number
    nombre: string,
    abreviacion: string
}

export interface EntidadInterface extends Model<EntidadInterface, EntidadAttributes> {
    entidadId: number
    nombre: string,
    abreviacion: string,
    createdAt: string
    updatedAt: string
}

export const Entidad = db.define<EntidadInterface, EntidadAttributes>('entidades_federativas', {
    entidadId: {
        type: DataTypes.UUID,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: DataTypes.STRING,
    abreviacion: DataTypes.STRING
});

// Entidad.belongsTo(UserEntidad, {
//     foreignKey: 'entidadId',
//     // as: 'user'
// });