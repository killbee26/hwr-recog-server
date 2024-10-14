import { Router } from 'express';
import { signInWithProvider } from '../controller/authController';

const router = Router();

router.post('/signin', signInWithProvider);

export default router;
