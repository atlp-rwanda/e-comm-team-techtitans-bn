import {login} from "../controllers/user.login.controller";
import express from "express";


const loginRouter = express.Router();
loginRouter.post('/',login)


export default loginRouter;