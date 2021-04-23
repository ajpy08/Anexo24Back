import { DataTypes, Model } from "sequelize";
import db from "../db/connection";
import { Empresa } from "./empresa";
import { User } from "./user";

export interface UserEmpresaAttributes {
    userId: number
    empresaId: number
}

export interface UserEmpresaModel extends Model<UserEmpresaModel, UserEmpresaAttributes> {
    userId: number
    empresaId: number
    createdAt: string
    updatedAt: string
}

export const UserEmpresa = db.define<UserEmpresaModel, UserEmpresaAttributes>('user_empresas', {
    userId: {
        type: DataTypes.UUID,
        primaryKey: true
    },
    empresaId: {
        type: DataTypes.UUID,
        primaryKey: true
    },
});

UserEmpresa.belongsTo(Empresa, {
    foreignKey: 'empresaId',
    // as: 'user'
});

// UserEmpresa.hasMany(User, {
//     /*
//       You can omit the sourceKey property
//       since by default sequelize will use the primary key defined
//       in the model - But I like to be explicit
//     */
//     sourceKey: 'userId',
//     foreignKey: 'userId',
//     // as: 'users'
// });

// UserEmpresa.hasMany(Empresa, {
//     /*
//       You can omit the sourceKey property
//       since by default sequelize will use the primary key defined
//       in the model - But I like to be explicit
//     */
//     sourceKey: 'empresaId',
//     foreignKey: 'empresaId',
//     // as: 'empresas'
// });