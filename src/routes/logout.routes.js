import logoutController from "../controllers/user.logout.controller";
import express from "express";


const logoutRouter = express.Router();
logoutRouter.post("/",logoutController)

export default logoutRouter