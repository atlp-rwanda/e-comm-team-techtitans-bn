import express from 'express';

import { verifyUser, createUser,updateProfile,findAllUsers, login } from '../controllers/user.controller';

const userRouter = express.Router();

// Create a new Tutorial
userRouter.post('/signup', verifyUser);
userRouter.get('/signup/:token', createUser);
userRouter.post('/login',login)
userRouter.put('/:uuid', updateProfile);
userRouter.get('/profile/users',findAllUsers);
export default userRouter;
