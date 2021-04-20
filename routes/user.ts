import { deleteUser, getUser, getUsers, postUser, putUser, signin } from '../controllers/users';
import { Router } from 'express';

const router = Router();

router.get('/login/', signin);
router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/', postUser);
router.put('/:id', putUser);
router.delete('/:id', deleteUser);

export default router;