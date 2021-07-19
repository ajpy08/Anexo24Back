import { deleteAgenteAduanal, getAgenteAduanal, getAgentesAduanales, postAgenteAduanal, putAgenteAduanal } from '../controllers/agenteAduanalController';
import { Router } from 'express';
import { verifyToken } from '../controllers/authController';
import { Request, Response } from "express";

const router = Router();

router.get('/:act', verifyToken, (req: Request, res: Response) => {
    getAgentesAduanales(req, res).then(agentes => {
        if (agentes) {
            res.status(200).json({
                agentes,
                total: agentes.length
            });
        } else {
            res.status(400).json({
                msg: `No existen agentes`,
            });
        }
    }).catch(error => {
        res.status(500).json({
            msg: `Ocurrio un error ${error}`
        });
    });
});
router.get('/agente/:id', verifyToken, (req: Request, res: Response) => {
    getAgenteAduanal(req, res).then(agente => {
        if (agente) {
            res.status(200).json({
                agente
            });
        } else {
            res.status(400).json({
                msg: `No existe un agente con el id ${req.params.id}`
            });
        }
    });
});
router.post('/', verifyToken, async (req: Request, res: Response) => {
    postAgenteAduanal(req, res).then(async agente => {
        res.status(200).json({
            agente
        });

    }).catch(error => {
        res.status(500).json({
            msg: `Ocurrio un error ${error}`
        });
    });
});

router.put('/:id', verifyToken, async (req: Request, res: Response) => {
    const { id } = req.params;
    const { body } = req;

    putAgenteAduanal(req, res).then(async agente => {
        res.status(200).json({
            agente
        });
    }).catch(error => {
        res.status(500).json({
            msg: `Ocurrio un error ${error}`
        });
    });
});

router.delete('/:id', verifyToken, async (req: Request, res: Response) => {
    deleteAgenteAduanal(req, res).then(agente => {
        if (agente) {
            res.status(200).json({
                agente
            });
        } else {
            res.status(400).json({
                msg: `No se encontró agente con id ${req.params.id}`
            });
        }
    }).catch(error => {
        res.status(500).json({
            msg: `Ocurrio un error ${error}`
        });
    });
});

export default router;