import { Router } from 'express';
import userRouter from './user.routes';
import authRouter from './oauth.routes';

const router = Router();

router.use('/user', userRouter);
router.use('/auth', authRouter);

export default router;
