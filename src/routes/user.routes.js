import express from 'express';

import { verifyUser, createUser,login } from '../controllers/user.controller';

const userRouter = express.Router();

// Create a new Tutorial
userRouter.post('/signup', verifyUser);
userRouter.get('/signup/:token', createUser);
userRouter.post('/login',login)

export default userRouter;
