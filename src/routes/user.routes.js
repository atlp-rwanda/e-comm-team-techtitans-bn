import express from "express";
import Role from "../controllers/user/role.controller";
// import roles from './roles.routes';
import {
  isAdmin,
  isBuyer,
  isSeller,
  checkPermission,
} from "../middleware/auth/auth.middleware";
import { verifyUser, createUser } from "../controllers/user/signup.controller";
import login from "../controllers/user/login.controller";
import logout from "../controllers/user/logout.controller";
import {
  forgotPassword,
  getResetPassword,
  resetPassword,
} from '../controllers/user/forgotPassword.controller';
import findAllUsers from '../controllers/user/findAllUsers.controller';
import updateProfile from '../controllers/user/profile.controller';
import editPassword from '../controllers/user/user.edit.password';
import verifyOtp from '../controllers/user/2fauthentication.controller';
import RestrictPassword from '../middleware/auth/check.password.update';
import disableEnableUsers from '../controllers/user/disableEnableUsers.controller';
import { searchForUsers } from '../controllers/user/userSearch.controller';


import {
  verifySubscriber,
  createSubscriber,
  updateSubscriber,
  deleteSubscriber,
} from "../controllers/subscriber/signup.controller";

const userRouter = express.Router();

// Verify user email and then create a new user
userRouter.post("/signup", verifyUser);
userRouter.get("/signup/:token", createUser);

// User login and logout
userRouter.post("/login", login);
userRouter.post("/login/verifyOtp", verifyOtp);
userRouter.post("/logout", logout);

// Forgot password and reset password
userRouter.patch("/forgot-password", forgotPassword);
userRouter.get("/reset-password/:id/:token", getResetPassword);
userRouter.post("/reset-password/:id/:token", resetPassword);

// Update user profile
userRouter.put("/profile", updateProfile);

// Get all users
userRouter.get(

  "/profile/users",

  isAdmin,
  checkPermission("manage users"),
  findAllUsers,
);
userRouter.put(
  '/role/:id',
  isAdmin,
  checkPermission("manage users"),
  Role.setRole,
);

// update user password
userRouter.put('/editpassword/:id', editPassword);
// disable and enable user account

//update user password
userRouter.put("/editpassword/:id", editPassword);
//disable and enable user account

userRouter.put(
  "/updateAccountStatus/:id",
  isAdmin,
  checkPermission("manage users"),
  disableEnableUsers
);

userRouter.get('/search', searchForUsers);
userRouter.post("/subscriber", verifySubscriber);
userRouter.get("/subscriber/:token", createSubscriber);
userRouter.patch("/subscriber/:id", updateSubscriber);
userRouter.get("/subscriber/delete/:id", deleteSubscriber);

export default userRouter;
