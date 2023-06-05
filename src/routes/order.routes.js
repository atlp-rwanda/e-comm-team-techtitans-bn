import express from "express";
import OrderStatus from "../controllers/order/updateOrderStatus.controller";
import getOrderStatus from "../controllers/order/order.status.track.controller";
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
import { sellerOrders } from "../controllers/order/sellerOrder.controller";

const orderRouter = express.Router();
//1. sellers update order status from "pending"to "shipped"
orderRouter.put("/updatestatus/:id", isSeller, OrderStatus);
orderRouter.post("/create", createOrder);
orderRouter.post("/", buyNowOrder);
orderRouter.get("/list-orders", listOrders);
// seller order
orderRouter.get("/orders", isSeller, sellerOrders);
orderRouter.get("/:orderId", isBuyer, getOrder);
orderRouter.delete("/delete/:id", isBuyer, deleteOrder);
orderRouter.put("/update/:id", isBuyer, updateOrder);
//order status tracking
orderRouter.get("/get/trackorder/:id", isBuyer, getOrderStatus);
orderRouter.post("/post/trackorder/:id", isSeller, getOrderStatus);

export default orderRouter;
