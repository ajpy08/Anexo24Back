import { NextFunction, Request, Response } from "express";
import { Empresa } from "../models/empresa";

export const getEmpresas = async (req: Request, res: Response) => {
    try {
        const empresas = await Empresa.findAll();

        res.status(200).json({
            empresas,
            total: empresas.length
        });
    } catch (error) {
        res.status(500).json({
            msg: `Ocurrio un error ${error}`
        });
    }
}

export const getEmpresa = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const empresa = await Empresa.findByPk(id);

        if (!empresa) {
            res.status(404).json({
                msg: `No existe una empresa con el id ${id}`
            });
        }

        res.status(200).json({
            empresa
        });
    } catch (error) {
        res.status(500).json({
            msg: `Ocurrio un error ${error}`
        });
    }

}

export const postEmpresa = async (req: Request, res: Response) => {
    const { body } = req;

    try {
        const existRFC = await Empresa.findOne({
            where: {
                rfc: body.rfc
            }
        });

        if (existRFC) {
            return res.status(400).json({
                msg: `Ya existe una empresa con el rfc ${body.rfc}`
            });
        }

        const empresa = Empresa.build(body);
        await empresa.save();

        res.status(200).json({
            empresa
        });
    } catch (error) {
        res.status(500).json({
            msg: `Ocurrio un error ${error}`
        });
    }
}

export const putEmpresa = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { body } = req;

    try {
        const empresa = await Empresa.findByPk(id);
        if (!empresa) {
            return res.status(404).json({
                msg: `No existe una empresa con el id ${id}`
            });
        }

        await empresa.update(body);

        res.status(200).json({
            empresa
        });

    } catch (error) {
        res.status(500).json({
            msg: `Ocurrio un error ${error}`
        });
    }
}

export const deleteEmpresa = async (req: Request, res: Response) => {
    const { id } = req.params;

    const empresa = await Empresa.findByPk(id);

    if (!empresa) {
        res.status(404).json({
            msg: `No existe una empresa con el id ${id}`
        });
    }

    // await empresa?.destroy();

    await empresa?.update({ estado: false });

    res.status(200).json({
        empresa
    });
}

