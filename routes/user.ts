import { verificaEmail } from '../controllers/userController';
import { deleteUser, getUser, getUsers, postUser, putUser } from '../controllers/userController';
import { Router } from 'express';
import { verifyToken } from '../controllers/authController';
import { Request, Response } from "express";
import db from '../db/connection';
import { UserEmpresa } from '../models/userEmpresa';
import empresaController from '../controllers/empresaController';
import { User } from '../models/user';
import { INTEGER } from 'sequelize/types';

const router = Router();

// router.get('/:act', verifyToken, getUsers);
router.get('/:act', verifyToken, (req: Request, res: Response) => {
    getUsers(req, res).then(users => {
        if (users) {
            res.status(200).json({
                users,
                total: users.length
            });
        } else {
            res.status(400).json({
                msg: `No existen users`,
            });
        }
    }).catch(error => {
        res.status(500).json({
            msg: `Ocurrio un error ${error}`
        });
    });
});
router.get('/user/:id', verifyToken, (req: Request, res: Response) => {
    getUser(req, res).then(user => {
        if (user) {
            res.status(200).json({
                user
            });
        } else {
            res.status(400).json({
                msg: `No existe un user con el id ${req.params.id}`
            });
        }
    });
});
router.post('/', verifyToken, async (req: Request, res: Response) => {
    const { body } = req;

    const existeEmail = await verificaEmail(req, res);

    if (existeEmail) {
        return res.status(400).json({
            msg: `Ya existe un usuario con el email ${body.email}`
        });
    }

    // Transaccion Automatica
    // await db.transaction(async t => {

    // Transaccion Manual
    const t = await db.transaction();
    postUser(req, res, t).then(async user => {
        if (body.empresas) {

            for (const empresaId of body.empresas) {
                const userEmpresa = UserEmpresa.build({
                    userId: user.userId,
                    empresaId
                });

                await userEmpresa.save({ transaction: t });
            }
        }
        await t.commit();
        res.status(200).json({
            user: body
        });

    }).catch(error => {
        t.rollback();
        res.status(500).json({
            msg: `Ocurrio un error ${error}`
        });
    });
    // });
});

router.put('/:id', verifyToken, async (req: Request, res: Response) => {
    const { id } = req.params;
    const { body } = req;

    const t = await db.transaction();
    const userMod = User.build(body);
    userMod.userId = parseInt(id, 10);
    putUser(req, res, t).then(async userUpdate => {
        // Buscar y eliminar empresas guardadas del usuario
        req.params.userId = req.params.id;
        const empresas = await empresaController.getEmpresasByUser(req, res, t);
        if (empresas && empresas.length > 0) {
            for (const empresa of empresas) {
                const userEmpresa = await UserEmpresa.findOne({
                    where: {
                        userId: id, empresaId: empresa.empresaId
                    },
                    transaction: t
                });

                if (userEmpresa) {
                    await userEmpresa.destroy({ transaction: t });
                }
            }
        }

        if (body.empresas && userUpdate) {

            for (const empresaId of body.empresas) {
                const userEmpresa = UserEmpresa.build({
                    userId: userUpdate.userId,
                    empresaId
                });

                await userEmpresa.save({ transaction: t });
            }
        }
        await t.commit();
        res.status(200).json({
            user: userMod
        });
    }).catch(error => {
        t.rollback();
        res.status(500).json({
            msg: `Ocurrio un error ${error}`
        });
    });
});

// router.delete('/:id', verifyToken, deleteUser);
router.delete('/:id', verifyToken, async (req: Request, res: Response) => {
    deleteUser(req, res).then(user => {
        if (user) {
            res.status(200).json({
                user
            });
        } else {
            res.status(400).json({
                msg: `No se encontró user con id ${req.params.id}`
            });
        }
    }).catch(error => {
        res.status(500).json({
            msg: `Ocurrio un error ${error}`
        });
    });
});

export default router;