import express from "express";
import OrderStatus from "../controllers/order/updateOrderStatus.controller";
import {
  createOrder,
  buyNowOrder,
  listOrders,
  getOrder,
  deleteOrder,
  updateOrder,
} from "../controllers/order/order.controller";
import {
  isAdmin,
  isSeller,
  isBuyer,
  checkPermission,
} from "../middleware/auth/auth.middleware.js";

const orderRouter = express.Router();
//1. sellers update order status from "pending"to "shipped"
orderRouter.put("/updatestatus/:id", isSeller, OrderStatus);
orderRouter.post("/create", isBuyer, createOrder);
orderRouter.post("/", isBuyer, buyNowOrder);
orderRouter.get("/list-orders", isBuyer, listOrders);
orderRouter.get("/:id", isBuyer, getOrder);
orderRouter.delete("/delete/:id", isBuyer, deleteOrder);
orderRouter.put("/update/:id", isBuyer, updateOrder);
export default orderRouter;
