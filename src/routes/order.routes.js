import express from "express";
import OrderStatus from "../controllers/order/updateOrderStatus.controller";
import {
    isAdmin,
    isSeller,
    isBuyer,
    checkPermission,
  } from '../middleware/auth/auth.middleware.js';

const orderRouter = express.Router()
//1. sellers update order status from "pending"to "shipped"
orderRouter.put('/updatestatus/:uuid',isSeller, OrderStatus);

export default orderRouter