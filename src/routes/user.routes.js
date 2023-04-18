import express from "express";
import Role from "../controllers/user/role.controller";
// import roles from './roles.routes';

import { verifyUser, createUser } from "../controllers/user/signup.controller";
import login from "../controllers/user/login.controller";
import logout from "../controllers/user/logout.controller";
import {
  forgotPassword,
  getResetPassword,
  resetPassword,
} from "../controllers/user/forgotPassword.controller";
import findAllUsers from "../controllers/user/findAllUsers.controller";
import updateProfile from "../controllers/user/profile.controller";
import editPassword from "../controllers/user/user.edit.password";
import {
  wishlist,
  getAllWishes,
} from "../controllers/product/wishlist.controller";

import verifyOtp from "../controllers/user/2fauthentication.controller";
import RestrictPassword from "../middleware/auth/check.password.update";
import disableEnableUsers from "../controllers/user/disableEnableUsers.controller";
import {
  isAdmin,
  isSeller,
  isBuyer,
  checkPermission,
} from "../middleware/auth/auth.middleware.js";

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

userRouter.put("/:uuid", RestrictPassword, updateProfile);

// Get all users
userRouter.get("/profile/users", findAllUsers);
userRouter.post("/role", Role.setRole);

//update user password
userRouter.put("/editpassword/:uuid", editPassword);
userRouter.post("/wishlist", isBuyer, wishlist);
userRouter.get("/wishlist/:token", getAllWishes);

export default userRouter;
