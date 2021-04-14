import {signup, signin, profile} from '../controllers/auth';
import {Router} from 'express';

const router: Router = Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/profile', profile);

export default router;