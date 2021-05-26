import { Empresa } from './../models/empresa';
import { Request, Response } from "express";
import { QueryTypes } from "sequelize";
import db from "../db/connection";
import empresaController from './../controllers/empresa';

export = {
    getEmpresas: async (req: Request, res: Response) => {
        // try {
        return db.query('SELECT * from empresas', {
            type: QueryTypes.SELECT,
            model: Empresa
        });

        // res.status(200).json({
        //     empresas,
        //     total: empresas.length
        // });
        // } catch (error) {
        //     res.status(500).json({
        //         msg: `Ocurrio un error ${error}`
        //     });
        // }
    },
    getEmpresa: (req: Request, res: Response) => {
        const { id } = req.params;

        // return Empresa.findByPk(id);

        return db.query(
            'SELECT * FROM empresas WHERE empresaId = :id',
            {
                replacements: { id },
                type: QueryTypes.SELECT
            }
        );
    },
    getEmpresasByUser: (req: Request, res: Response) => {
        const { userId } = req.params;

        return db.query(
            'SELECT empresas.* FROM empresas ' +
            'INNER JOIN user_empresas USING (empresaId) ' +
            'INNER JOIN users USING (userId) ' +
            'WHERE users.userId = :userId',
            {
                replacements: { userId },
                type: QueryTypes.SELECT,
                model: Empresa
            }
        );
    },
    postEmpresa: (req: Request, res: Response) => {
        const { body } = req;

        const empresa = Empresa.build(body);
        return empresa.save();

        // return db.query(
        //     `INSERT INTO empresas (rfc, nombre) VALUES ("${empresa.rfc}", "${empresa.nombre}");`,
        //     {
        //         type: QueryTypes.INSERT
        //     }
        // ).then((result) => {
        //     empresa.id = result[0];
        // });
    },
    verificaRFC: (req: Request, res: Response) => {
        const { body } = req;
        return Empresa.findOne({
            where: {
                rfc: body.rfc
            }
        });
    },
    putEmpresa: async (req: Request, res: Response) => {
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
    },
    deleteEmpresa: async (req: Request, res: Response) => {
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
}