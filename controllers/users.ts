import { Request, Response } from "express";
import { User } from "../models/user";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const getUsers = async (req: Request, res: Response) => {

    const users = await User.findAll();

    res.json({
        users
    });
}

export const getUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
        res.status(404).json({
            msg: `No existe un usuario con el id ${id}`
        });
    }

    res.json({
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

        res.json({
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

        res.json({
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

    res.json({
        user
    });
}

export const signin = async (req: Request, res: Response) => {
    const { body } = req;

    const user = await User.findOne({
        where: {
            email: body.email
        }
    });

    if (!user) {
        res.status(404).json({
            msg: `No existe un usuario ${body.email}`
        });
    }

    if (user?.estado === false) {
        return res.status(400).json({
            ok: false,
            mensaje: 'El user se encuentra deshabilitado'
        });
    }

    if (user) {
        if (!bcrypt.compareSync(body.password, user.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas'
            });
        }
        user.password = '=)';
    }

    // token
    const token: string = jwt.sign({ user }, process.env.TOKEN_SECRET || 'tokentest', {
        expiresIn: 86400 // 24 hours
    });

    res.json({
        user,
        token
    });
}

