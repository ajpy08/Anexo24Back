import { Request, Response } from "express";
import { Direccion } from "../models/direccion";
import bcrypt from 'bcryptjs';
import { Transaction } from 'sequelize/types';

export const getDirecciones = (req: Request, res: Response, t?: Transaction) => {
    const { activo } = req.params;
    const estado = activo === 'true' ? true : false;

    return Direccion.findAll({
        where: {
            estado
        },
        transaction: t,
    });
}

export const getDireccion = (req: Request, res: Response, t?: Transaction) => {
    const { id } = req.params;
    return Direccion.findByPk(id, { transaction: t });
}

export const getDireccionesByEmpresa = (req: Request, res: Response, t?: Transaction) => {
    const { empresaId } = req.params;

    return Direccion.findAll({
        where: {
            empresaId,
        },
        transaction: t,
    });
}

export const postDireccion = async (req: Request, res: Response, t?: Transaction) => {
    const { body } = req;

    const direccion = Direccion.build(body);
    return direccion.save({ transaction: t });
}

export const putDireccion = async (req: Request, res: Response, t?: Transaction) => {
    const { body } = req;

    const direccion = await getDireccion(req, res);

    if (!direccion) {
        return;
    } else {
        return direccion.update(body, { transaction: t });
    }
}

export const deleteDireccion = async (req: Request, res: Response, t?: Transaction) => {
    // const { activo } = req.body;

    const direccion = await getDireccion(req, res);

    if (!direccion) {
        return;
    }

    return direccion?.destroy({ transaction: t });
    // return direccion?.update({ estado: activo }, { transaction: t });
}

