import express from 'express';
import payments from '../controllers/user/pay.controller';
import { isBuyer, checkPermission } from '../middleware/auth/auth.middleware';
import RestrictPassword from '../middleware/auth/check.password.update';

const router = express.Router();

router.post('/', RestrictPassword,isBuyer,checkPermission('make payment'), payments.pay);

export default router;
