import express from 'express';
import checkout from '../controllers/product/checkout.controller';
import { isBuyer, checkPermission } from '../middleware/auth/auth.middleware';
import RestrictPassword from '../middleware/auth/check.password.update';

const router = express.Router();

router.post('/', checkout.check);
// router.get('/', RestrictPassword, isBuyer, checkPermission('make payment'), checkout.check);

export default router;
