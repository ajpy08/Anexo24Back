import { getDireccion } from './../controllers/direccionController';
import empresaController from '../controllers/empresaController';
import { Router } from 'express';
import { verifyToken } from '../controllers/authController';
import { Request, Response } from "express";
import db from '../db/connection';
import { Direccion } from '../models/direccion';

const router = Router();

router.get('/:activo', verifyToken, (req: Request, res: Response) => {
    empresaController.getEmpresas(req, res).then(empresas => {
        if (empresas) {
            res.status(200).json({
                empresas,
                total: empresas.length
            });
        } else {
            res.status(400).json({
                msg: `No existen empresas`,
            });
        }
    }).catch(error => {
        res.status(500).json({
            msg: `Ocurrio un error ${error}`
        });
    });
});

router.get('/empresa/:id', verifyToken, (req: Request, res: Response) => {
    empresaController.getEmpresa(req, res).then(empresa => {
        if (empresa) {
            res.status(200).json({
                empresa: empresa[0]
            });
        } else {
            res.status(400).json({
                msg: `No existe una empresa con el id ${req.params.id}`
            });
        }
    });
});

router.get('/user/:userId', verifyToken, (req: Request, res: Response) => {
    empresaController.getEmpresasByUser(req, res).then(empresas => {
        if (empresas) {
            res.status(200).json({
                empresas,
                total: empresas.length
            });
        } else {
            res.status(400).json({
                msg: `No existen empresas`,
            });
        }
    }).catch(error => {
        res.status(500).json({
            msg: `Ocurrio un error ${error}`
        });
    });
});

router.post('/', verifyToken, async (req: Request, res: Response) => {
    const { body } = req;

    const existeRFC = await empresaController.verificaRFC(req, res);

    if (existeRFC) {
        return res.status(400).json({
            msg: `Ya existe una empresa con el rfc ${body.rfc}`
        });
    }
    // Transaccion Manual
    const t = await db.transaction();

    empresaController.postEmpresa(req, res, t).then(async empresa => {
        if (body.direcciones) {
            for (const d of body.direcciones) {
                d.empresaId = empresa.empresaId;
                const direccion = Direccion.build(d);

                await direccion.save({ transaction: t });
            }
        }
        await t.commit();
        res.status(200).json({
            empresa
        });
    }).catch(error => {
        t.rollback();
        res.status(500).json({
            msg: `Ocurrio un error ${error}`
        });
    });
});

router.get('/verificaRFC', verifyToken, (req: Request, res: Response) => {
    empresaController.verificaRFC(req, res).then(empresa => {
        if (empresa) {
            res.status(200).json({
                empresa
            });
        } else {
            res.status(400).json({
                msg: `No existe empresa con RFC ${req.body.rfc}`,
            });
        }
    }).catch(error => {
        res.status(500).json({
            msg: `Ocurrio un error ${error}`
        });
    });
});

router.put('/:id', verifyToken, async (req: Request, res: Response) => {
    const { body } = req;
    const t = await db.transaction();

    empresaController.putEmpresa(req, res).then(async empresaUpdate => {
        // Buscar y eliminar direcciones de la empresa

        // req.params.empresaId = req.params.id;
        // const direccionesEmp = await getDireccionesByEmpresa(req, res, t);

        // if (direccionesEmp && direccionesEmp.length > 0) {
        // for (const d of direccionesEmp) {
        //     const direccion = await Direccion.findOne({
        //         where: {
        //             direccionId: d.direccionId
        //         },
        //         transaction: t
        //     });

        //     if (direccion) {
        //         await direccion.destroy({ transaction: t });
        //     }
        // }

        if (body.direcciones && empresaUpdate) {
            for (const d of body.direcciones) {
                if (d.direccionId === 0) {
                    const direccion = Direccion.build(d);
                    await direccion.save({ transaction: t });
                } else {
                    req.params.id = d.direccionId;
                    const direccion = await getDireccion(req, res, t);
                    if (direccion) {
                        await direccion.update(d, { transaction: t });
                    }
                }
            }
        }
        // }
        await t.commit();
        if (empresaUpdate) {
            res.status(200).json({
                empresa: empresaUpdate
            });
        } else {
            t.rollback();
            res.status(400).json({
                msg: `No se encontró empresa con id ${req.params.id}`
            });
        }
    }).catch(error => {
        t.rollback();
        res.status(500).json({
            msg: `Ocurrio un error ${error}`
        });
    });
});

router.delete('/:id', verifyToken, (req: Request, res: Response) => {
    empresaController.deleteEmpresa(req, res).then(empresa => {
        if (empresa) {
            res.status(200).json({
                empresa
            });
        } else {
            res.status(400).json({
                msg: `No se encontró empresa con id ${req.params.id}`
            });
        }
    }).catch(error => {
        res.status(500).json({
            msg: `Ocurrio un error ${error}`
        });
    });
});

export default router;