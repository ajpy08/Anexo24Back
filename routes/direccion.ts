import { getDireccionesByEmpresa } from './../controllers/direccionController';
import { deleteDireccion, getDireccion, getDirecciones, postDireccion, putDireccion } from '../controllers/direccionController';
import { Router } from 'express';
import { verifyToken } from '../controllers/authController';
import { Request, Response } from "express";
import db from '../db/connection';
import { Direccion } from '../models/direccion';

const router = Router();

router.get('/:activo', verifyToken, (req: Request, res: Response) => {
    getDirecciones(req, res).then(direcciones => {
        if (direcciones) {
            res.status(200).json({
                direcciones,
                total: direcciones.length
            });
        } else {
            res.status(400).json({
                msg: `No existen direcciones`,
            });
        }
    }).catch(error => {
        res.status(500).json({
            msg: `Ocurrio un error ${error}`
        });
    });
});
router.get('/direccion/:id', verifyToken, (req: Request, res: Response) => {
    getDireccion(req, res).then(direccion => {
        if (direccion) {
            res.status(200).json({
                direccion
            });
        } else {
            res.status(400).json({
                msg: `No existe una direccion con el id ${req.params.id}`
            });
        }
    });
});
router.get('/direccion/empresa/:empresaId', verifyToken, (req: Request, res: Response) => {
    getDireccionesByEmpresa(req, res).then(direcciones => {
        if (direcciones) {
            res.status(200).json({
                direcciones,
                total: direcciones.length
            });
        } else {
            res.status(400).json({
                msg: `No existen direcciones`,
            });
        }
    }).catch(error => {
        res.status(500).json({
            msg: `Ocurrio un error ${error}`
        });
    });
});
router.post('/', verifyToken, async (req: Request, res: Response) => {
    const t = await db.transaction();
    postDireccion(req, res, t).then(async direccion => {
        t.commit();
        res.status(200).json({
            direccion
        });
    }).catch(error => {
        t.rollback();
        res.status(500).json({
            msg: `Ocurrio un error ${error}`
        });
    });
});

router.put('/:id', verifyToken, async (req: Request, res: Response) => {
    const t = await db.transaction();
    putDireccion(req, res, t).then(direccionUpdated => {
        if (direccionUpdated) {
            t.commit();
            res.status(200).json({
                direccion: direccionUpdated
            });
        }
    }).catch(error => {
        t.rollback();
        res.status(500).json({
            msg: `Ocurrio un error ${error}`
        });
    });
});

router.delete('/:id', verifyToken, async (req: Request, res: Response) => {
    deleteDireccion(req, res).then(direccion => {

        if (direccion !== undefined) {
            res.status(200).json({
                direccion
            });
        } else {
            return res.status(400).json({
                msg: `No se encontró direccion con id ${req.params.id}`
            });
        }
    }).catch(error => {
        res.status(500).json({
            msg: `Ocurrio un error ${error}`
        });
    });
});

export default router;