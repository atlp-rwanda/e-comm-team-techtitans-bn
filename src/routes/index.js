import { Router } from 'express';
import userRouter from './user.routes';
import productRouter from './product.routes';

const router = Router();

router.use('/user', userRouter);
router.use('/product', productRouter);

export default router;
