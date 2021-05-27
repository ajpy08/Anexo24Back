import { UserEmpresa } from '../models/userEmpresa';
import { Request, Response } from "express";
import { User } from "../models/user";
import bcrypt from 'bcryptjs';
import db from '../db/connection';
import empresaController from './empresaController';

export const getUsers = async (req: Request, res: Response) => {
    const { act } = req.params;
    const estado = act === 'true' ? true : false;
    try {
        const users = await User.findAll({
            where: {
                estado
            }
        });

        // const users = await User.findAll({
        //     attributes: ['nombre', 'email'],
        //     include: [
        //         {
        //             attributes: {
        //                 // include: ['createdAt'],
        //                 exclude: ['userId', 'empresaId', 'updatedAt']
        //             },
        //             model: UserEmpresa,
        //             required: true,
        //             include: [{ model: Empresa, required: true }]
        //         }
        //     ],
        // });

        res.status(200).json({
            users,
            total: users.length
        });
    } catch (error) {
        res.status(500).json({
            msg: `Ocurrio un error ${error}`
        });
    }
}

export const getUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);

        if (!user) {
            res.status(404).json({
                msg: `No existe un usuario con el id ${id}`
            });
        }

        res.status(200).json({
            user
        });
    } catch (error) {
        res.status(500).json({
            msg: `Ocurrio un error ${error}`
        });
    }
}

export const postUser = async (req: Request, res: Response) => {
    const { body } = req;
    if (body.password) {
        body.password = bcrypt.hashSync(body.password, 10);
    }

    /* #region  Otra forma */
    // try {
    //     const existEmail = await User.findOne({
    //         where: {
    //             email: body.email
    //         }
    //     });

    //     if (existEmail) {
    //         return res.status(400).json({
    //             msg: `Ya existe un usuario con el email ${body.email}`
    //         });
    //     }

    //     const user = User.build(body);
    //     await user.save().then((userAdd) => {
    //         UserEmpresa.create({
    //             userId: userAdd.userId,
    //             empresaId: body.empresaId
    //         }).then(() => {
    //             res.status(200).json({
    //                 user
    //             });
    //         });
    //     });
    // } catch (error) {
    //     res.status(500).json({
    //         msg: `Ocurrio un error ${error}`
    //     });
    // }
    /* #endregion */

    const existEmail = await User.findOne({
        where: {
            email: body.email
        }
    });

    if (existEmail) {
        return res.status(400).json({
            msg: `Ya existe un usuario con el email ${body.email}`
        });
    }

    try {
        const createdUser = await db.transaction(async t => {
            const user = User.build(body);
            await user.save({ transaction: t }).then(async (userAdd) => {
                if (body.empresas) {

                    for (const empresaId of body.empresas) {
                        const userEmpresa = UserEmpresa.build({
                            userId: userAdd.userId,
                            empresaId
                        });

                        await userEmpresa.save({ transaction: t }).then();
                        // t.commit();
                    }
                }
            });
            res.status(200).json({
                user
            });
        });
    } catch (error) {
        res.status(500).json({
            msg: `Ocurrio un error ${error}`
        });
    }
}

export const putUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { body } = req;
    // body.password = bcrypt.hashSync(body.password, 10);
    body.password = "=)"

    try {
        const user = await User.findByPk(id);
        if (user) {
            // dejamos el mismo password que originalmente tenia.
            body.password = user.password;
        }
        if (!user) {
            return res.status(404).json({
                msg: `No existe un usuario con el id ${id}`
            });
        }

        // await user.update(body);

        // res.status(200).json({
        //     user
        // });

        const updatedUser = await db.transaction(async t => {
            const userMod = User.build(body);
            await user.update(body, { transaction: t }).then(async (userUpdate) => {
                // Buscar y eliminar empresas guardadas del usuario
                req.params.userId = req.params.id;
                const empresas = await empresaController.getEmpresasByUser(req, res);
                if (empresas && empresas.length > 0) {
                    for (const empresa of empresas) {
                        const userEmpresa = await UserEmpresa.findOne({
                            where: {
                                userId: id, empresaId: empresa.empresaId
                            }
                        });

                        if (userEmpresa) {
                            await userEmpresa.destroy({ transaction: t });
                        }
                        // if (!userEmpresa) {
                        //     return res.status(404).json({
                        //         msg: `No existe un usuarioEmpresa con el id ${id}`
                        //     });
                        // }
                    }

                    if (body.empresas) {

                        for (const empresaId of body.empresas) {
                            const userEmpresa = UserEmpresa.build({
                                userId: userUpdate.userId,
                                empresaId
                            });

                            await userEmpresa.save({ transaction: t }).then();
                            // t.commit();
                        }
                    }

                    res.status(200).json({
                        user: userMod
                    });
                }
            });
        });

    } catch (error) {
        res.status(500).json({
            msg: `Ocurrio un error ${error}`
        });
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { activo } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
        res.status(404).json({
            msg: `No existe un usuario con el id ${id}`
        });
    }

    // await user?.destroy();

    await user?.update({ estado: activo });

    res.status(200).json({
        user
    });
}

