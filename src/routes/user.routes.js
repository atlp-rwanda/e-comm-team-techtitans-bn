import express from "express";


import {
  verifyUser,
  createUser,
  forgotPassword,
  getResetPassword,
  resetPassword,
  updateProfile,findAllUsers, 
  login,
} from "../controllers/user.controller";


const userRouter = express.Router();

// Create a new Tutorial


userRouter.post("/signup", verifyUser);
userRouter.get("/signup/:token", createUser);
userRouter.post("/login", login);

userRouter.patch("/forgot-password", forgotPassword);
userRouter.get("/reset-password/:id/:token", getResetPassword);
userRouter.post("/reset-password/:id/:token", resetPassword);
userRouter.put('/:uuid', updateProfile);
userRouter.get('/profile/users',findAllUsers);



export default userRouter;
