import { NextFunction, Request, Response } from "express";
import { User } from "../models/user";
import bcrypt from 'bcryptjs';

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await User.findAll();

        res.status(200).json({
            users,
            total: users.length
        });
    } catch (error) {
        next(error);
    }
}

export const getUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
        res.status(404).json({
            msg: `No existe un usuario con el id ${id}`
        });
    }

    res.status(200).json({
        user
    });
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
        await user.save();

        res.status(200).json({
            user
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
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
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
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

