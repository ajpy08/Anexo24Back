import { deleteEmpresa, getEmpresa, getEmpresas, postEmpresa, putEmpresa } from '../controllers/empresa';
import { Router } from 'express';
import { verifyToken } from '../controllers/auth';

const router = Router();

router.get('/', verifyToken, getEmpresas);
router.get('/:id', verifyToken, getEmpresa);
router.post('/', verifyToken, postEmpresa);
router.put('/:id', verifyToken, putEmpresa);
router.delete('/:id', verifyToken, deleteEmpresa);

export default router;