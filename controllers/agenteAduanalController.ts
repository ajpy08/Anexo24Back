import { AgenteAduanal } from './../models/agenteAduanal';
import { Request, Response } from "express";
import db from '../db/connection';
import { Transaction } from 'sequelize/types';

export const getAgentesAduanales = (req: Request, res: Response, t?: Transaction) => {
    const { act } = req.params;
    const estado = act === 'true' ? true : false;

    return AgenteAduanal.findAll({
        where: {
            estado
        },
        transaction: t
    });
}

export const getAgenteAduanal = (req: Request, res: Response, t?: Transaction) => {
    const { id } = req.params;
    return AgenteAduanal.findByPk(id, { transaction: t });
}

export const postAgenteAduanal = async (req: Request, res: Response, t?: Transaction) => {
    const { body } = req;
    const agente = AgenteAduanal.build(body);
    return agente.save({ transaction: t });
}

export const putAgenteAduanal = async (req: Request, res: Response, t?: Transaction) => {
    const { body } = req;

    const agente = await getAgenteAduanal(req, res);

    if (!agente) {
        return;
    } else {
        return agente.update(body, { transaction: t });
    }
}

export const deleteAgenteAduanal = async (req: Request, res: Response, t?: Transaction) => {
    const { activo } = req.body;

    const agente = await getAgenteAduanal(req,res);

    if (!agente) {
        return;
    }

    return agente?.update({ estado: activo }, { transaction: t });
}

