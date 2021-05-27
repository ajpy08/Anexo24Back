import { signin } from '../controllers/authController';
import {Router} from 'express';

const router: Router = Router();

router.post('/login', signin);
// router.post('/verifyToken', verifyToken);

export default router;