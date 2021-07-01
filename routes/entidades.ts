import { Router, Request, Response } from "express";
import { verifyToken } from "../controllers/authController";
import { getEntidades } from './../controllers/entidadesController';

const router = Router();

router.get('/', verifyToken, (req: Request, res: Response) => {
    getEntidades(req, res).then(entidades => {
        if (entidades) {
            res.status(200).json({
                entidades,
                total: entidades.length
            });
        } else {
            res.status(400).json({
                msg: `No existen entidades`,
            });
        }
    }).catch(error => {
        res.status(500).json({
            msg: `Ocurrio un error ${error}`
        });
    });
});

export default router;