import { Empresa } from './../models/empresa';
import { Request, Response } from "express";
import { QueryTypes } from "sequelize";
import db from "../db/connection";

export = {
    getEmpresas: async (req: Request, res: Response) => {
        try {
            const empresas = await db.query('SELECT * from empresas', {
                type: QueryTypes.SELECT
            });

            res.status(200).json({
                empresas,
                total: empresas.length
            });
        } catch (error) {
            res.status(500).json({
                msg: `Ocurrio un error ${error}`
            });
        }
    },
    getEmpresa: async (req: Request, res: Response) => {
        const { id } = req.params;

        try {

            // const empresa = await Empresa.findByPk(id);

            // const empresa = await db.query(`SELECT * from empresas WHERE id = ${id}` , {
            //     // A function (or false) for logging your queries
            //     // Will get called for every SQL query that gets sent
            //     // to the server.
            //     // logging: console.log,
            //     logging: false,

            //     // Set this to true if you don't have a model definition for your query.
            //     // raw: false,

            //     // The type of query you are executing. The query type affects how results are formatted before they are passed back.
            //     type: QueryTypes.SELECT
            // });

            const empresa = await db.query(
                'SELECT * FROM empresas WHERE empresaId = :id',
                {
                    replacements: { id: 1 },
                    type: QueryTypes.SELECT
                }
            );

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
    },
    getEmpresasByUser: async (req: Request, res: Response) => {
        const { userId } = req.params;
        try {
            const empresas = await db.query(
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

            if (!empresas) {
                res.status(404).json({
                    msg: `No existe una empresa para el usuario con id ${userId}`
                });
            }


            return empresas;
            // res.status(200).json({
            //     empresas,
            //     total: empresas.length
            // });
        } catch (error) {
            res.status(500).json({
                msg: `Ocurrio un error ${error}`
            });
        }
    },
    postEmpresa: async (req: Request, res: Response) => {
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

            // await db.query(
            //     `INSERT INTO empresas (rfc, nombre) VALUES ("${empresa.rfc}", "${empresa.nombre}");`,
            //     {
            //         type: QueryTypes.INSERT
            //     }
            // ).then((result) => {
            //     empresa.id = result[0];
            res.status(200).json({
                empresa
            });
            // });
        } catch (error) {
            res.status(500).json({
                msg: `Ocurrio un error ${error}`
            });
        }
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