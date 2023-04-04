import { Router } from "express";
import userRouter from "./user.routes";
import productRouter from "./product.routes";
const router = Router();

router.use("/user", userRouter);
router.use("/", productRouter);
export default router;
