import { Router } from 'express';
import userRouter from './user.routes';
import productRouter from './product.routes';
import authRouter from './oauth.routes';
import payment from './pay.routes';

const router = Router();

router.use('/user', userRouter);
router.use('/', productRouter);
router.use('/auth', authRouter);
router.use('/payment', payment);

export default router;
