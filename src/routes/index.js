import { Router } from 'express';
import userRouter from './user.routes';
import loginRouter from './login.routes'; // updated import statement
import logoutRouter from './logout.routes';

const router = Router();

router.use('/user', userRouter);
router.use('/login', loginRouter);
router.use('/logout', logoutRouter);

export default router;
