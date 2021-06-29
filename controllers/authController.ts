import { NextFunction, Request, Response } from 'express';
import { User } from '../models/user';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import config from '../config/config.json';



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
    const token: string = jwt.sign({ user }, process.env.TOKEN_SECRET || config.various.OPTIONAL_SEED, {
        // expira en 24 hours
        expiresIn: 86400
        // expiresIn: 3600
    });

    res.json({
        user,
        token
    });
}

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    // const token = req.query.token as string;
    const token = req.headers.token as string;

    // if (token === '') {
    //     return res.status(403).send()
    // }

    try {
        jwt.verify(token, process.env.TOKEN_SECRET || config.various.OPTIONAL_SEED, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    mensaje: 'Token incorrecto',
                    errores: err
                });
            }
            // console.log(decoded);
            next();
        })
    }
    catch (e) {
        return res.status(401).send()
    }
}