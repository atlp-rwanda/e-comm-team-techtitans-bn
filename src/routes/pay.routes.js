import express from 'express';
import payments from '../controllers/user/pay.controller';
import { isBuyer, checkPermission } from '../middleware/auth/auth.middleware';

const router = express.Router();

router.post('/', isBuyer,checkPermission('make payment'), payments.pay);

export default router;
