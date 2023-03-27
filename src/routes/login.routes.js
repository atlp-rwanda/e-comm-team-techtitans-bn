import { login, verifyOtp } from '../controllers/user.login.controller';
import express from 'express';

const loginRouter = express.Router();
loginRouter.post('/', login);
loginRouter.post('/verifyOtp', verifyOtp);

export default loginRouter;
