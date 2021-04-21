import { deleteUser, getUser, getUsers, postUser, putUser } from '../controllers/users';
import { Router } from 'express';
import { verifyToken } from '../controllers/auth';

const router = Router();

router.get('/', verifyToken, getUsers);
router.get('/:id', verifyToken, getUser);
router.post('/', verifyToken, postUser);
router.put('/:id', verifyToken, putUser);
router.delete('/:id', verifyToken, deleteUser);

export default router;