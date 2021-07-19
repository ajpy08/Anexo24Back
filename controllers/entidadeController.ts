import { Entidad } from '../models/entidad';
import { Request, Response } from "express";
import { QueryTypes, Transaction } from "sequelize";
import db from "../db/connection";

export const getEntidades = (req: Request, res: Response, t?: Transaction) => {
    return Entidad.findAll({transaction: t});
}