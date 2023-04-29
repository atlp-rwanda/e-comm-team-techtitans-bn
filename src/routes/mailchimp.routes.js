import express from 'express';
import mailchimp from '../controllers/mailchimp';

const router = express.Router();

router.post('/', mailchimp.send);

export default router;
