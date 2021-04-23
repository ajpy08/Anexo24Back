import { Empresa } from './../models/empresa';
import { UserEmpresa } from './../models/userEmpresa';
import { NextFunction, Request, Response } from "express";
import { User } from "../models/user";
import bcrypt from 'bcryptjs';

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.findAll();

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

    try {
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

        const user = User.build(body);
        await user.save().then((userAdd) => {
            UserEmpresa.create({
                userId: userAdd.userId,
                empresaId: body.empresaId
            }).then(() => {
                res.status(200).json({
                    user
                });
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
    body.password = bcrypt.hashSync(body.password, 10);

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({
                msg: `No existe un usuario con el id ${id}`
            });
        }

        await user.update(body);

        res.status(200).json({
            user
        });

    } catch (error) {
        res.status(500).json({
            msg: `Ocurrio un error ${error}`
        });
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
        res.status(404).json({
            msg: `No existe un usuario con el id ${id}`
        });
    }

    // await user?.destroy();

    await user?.update({ estado: false });

    res.status(200).json({
        user
    });
}

