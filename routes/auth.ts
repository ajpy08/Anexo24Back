import { verifyToken } from './../controllers/auth';
import { signin } from '../controllers/auth';
import {Router} from 'express';

const router: Router = Router();

router.post('/login', signin);
// router.post('/verifyToken', verifyToken);

export default router;