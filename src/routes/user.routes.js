import express from 'express';

import { verifyUser, createUser } from '../controllers/user/signup.controller';
import login from '../controllers/user/login.controller';
import logout from '../controllers/user/logout.controller';

const userRouter = express.Router();

// Create a new Tutorial
userRouter.post('/signup', verifyUser);
userRouter.get('/signup/:token', createUser);
userRouter.post('/login', login);
userRouter.post('/logout', logout);

export default userRouter;
