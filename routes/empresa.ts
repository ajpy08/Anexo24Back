import empresaController from './../controllers/empresa';
import { Router } from 'express';
import { verifyToken } from '../controllers/auth';

const router = Router();

router.get('/', verifyToken, empresaController.getEmpresas);
router.get('/:id', verifyToken, empresaController.getEmpresa);
router.post('/', verifyToken, empresaController.postEmpresa);
router.put('/:id', verifyToken, empresaController.putEmpresa);
router.delete('/:id', verifyToken, empresaController.deleteEmpresa);
router.get('/user/:userId', verifyToken, async (req, res) => {
    await empresaController.getEmpresasByUser(req, res)
});

export default router;