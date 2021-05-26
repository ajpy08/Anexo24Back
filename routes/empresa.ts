import { postUser } from './../controllers/users';
import empresaController from './../controllers/empresa';
import { Router } from 'express';
import { verifyToken } from '../controllers/auth';

const router = Router();

router.get('/', verifyToken, (req, res) => {
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

router.get('/:id', verifyToken, (req, res) => {
    empresaController.getEmpresa(req, res).then(empresa => {
        if (empresa) {
            res.status(200).json({
                empresa
            });
        } else {
            res.status(400).json({
                msg: `No existe una empresa con el id ${req.params.id}`
            });
        }
    });
});

router.get('/user/:userId', verifyToken, (req, res) => {
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

router.post('/', verifyToken, async (req, res) => {
    const { body } = req;

    const existeRFC = await empresaController.verificaRFC(req, res);

    if (existeRFC) {
        return res.status(400).json({
            msg: `Ya existe una empresa con el rfc ${body.rfc}`
        });
    }

    empresaController.postEmpresa(req, res).then(empresa => {
        res.status(200).json({
            empresa
        });
    }).catch(error => {
        res.status(500).json({
            msg: `Ocurrio un error ${error}`
        });
    });
});

router.get('/verificaRFC', verifyToken, (req, res) => {
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

router.put('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { body } = req;

    // const existeEmpresa = await empresaController.getEmpresa(req, res);

    // if (!existeEmpresa) {
    //     return res.status(400).json({
    //         msg: `No existe una empresa con el id ${id}`
    //     });
    // }

    empresaController.putEmpresa(req, res).then(empresa => {
        res.status(200).json({
            empresa
        });
    }).catch(error => {
        res.status(500).json({
            msg: `Ocurrio un error ${error}`
        });
    });
});

router.delete('/:id', verifyToken, empresaController.deleteEmpresa);

export default router;