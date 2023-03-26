import express from 'express';

import {
  verifyUser,
  createUser,
  deleteAllUsers,
  findAllUsers,
} from '../controllers/user.controller';

const userRouter = express.Router();

// Create a new Tutorial
userRouter.post('/', verifyUser);
userRouter.get('/:token', createUser);

userRouter.get('/findAllUsers', findAllUsers);

userRouter.delete('/deleteAll', deleteAllUsers);

export default userRouter;
