import { DataTypes, Model } from 'sequelize'
import db from '../db/connection';

export interface AgenteAduanalAttributes {
    agenteAduanalId: number
    patente: number,
    nombre: string,
    rfc: string,
    curp: string,
    calle: string,
    numero: string,
    cp: string,
    colonia: string,
    // domicilioFiscal: boolean,
    // tipo: number,
    estado: boolean,
    userAltaId: number,
    entidadId: number,
}

export interface AgenteAduanalInterface extends Model<AgenteAduanalInterface, AgenteAduanalAttributes> {
    agenteAduanalId: number
    patente: number,
    nombre: string,
    rfc: string,
    curp: string,
    calle: string,
    numero: string,
    cp: string,
    colonia: string,
    // domicilioFiscal: boolean,
    // tipo: number,
    estado: boolean,
    userAltaId: number,
    createdAt: string,
    updatedAt: string,
    entidadId: number,
}

// export interface AgenteAduanalViewModel {
//     agenteAduanalId: number
//     patente: number,
//     email: string
// }

export const AgenteAduanal = db.define<AgenteAduanalInterface, AgenteAduanalAttributes>('agentes_aduanales', {
    agenteAduanalId: {
        type: DataTypes.UUID,
        autoIncrement: true,
        primaryKey: true
    },
    patente: { type: DataTypes.NUMBER, allowNull: false },
    nombre: { type: DataTypes.STRING, allowNull: false },
    rfc: DataTypes.STRING,
    curp: DataTypes.STRING,
    calle: { type: DataTypes.STRING, allowNull: false },
    numero: { type: DataTypes.STRING, allowNull: false, unique: true },
    cp: { type: DataTypes.STRING, allowNull: false },
    colonia: { type: DataTypes.STRING, allowNull: false },
    // domicilioFiscal: DataTypes.BOOLEAN,
    // tipo: DataTypes.NUMBER,
    estado: DataTypes.BOOLEAN,
    userAltaId: {
        type: DataTypes.UUID
    },
    entidadId: {
        type: DataTypes.UUID
    },
});