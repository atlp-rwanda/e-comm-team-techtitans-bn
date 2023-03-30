import { Router } from 'express';
import userRouter from './user.routes';
import logoutRouter from "./logout.routes";
const router = Router();

router.use('/user', userRouter);
router.use('/logout',logoutRouter)
export default router;
