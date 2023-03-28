import express from 'express';

import { verifyUser, createUser } from '../controllers/user.controller';

const userRouter = express.Router();

// Create a new Tutorial
userRouter.post('/', verifyUser);
userRouter.get('/:token', createUser);

export default userRouter;
