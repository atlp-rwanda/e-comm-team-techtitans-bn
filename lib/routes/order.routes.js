"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _updateOrderStatus = _interopRequireDefault(require("../controllers/order/updateOrderStatus.controller"));
var _orderTrack = _interopRequireDefault(require("../controllers/order/order.track.controller"));
var _order = require("../controllers/order/order.controller");
var _authMiddleware = require("../middleware/auth/auth.middleware.js");
var _sellerOrder = require("../controllers/order/sellerOrder.controller");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// import getOrderStatus from "../controllers/order/order.status.track.controller";

const orderRouter = _express.default.Router();
//1. sellers update order status from "pending"to "shipped"
orderRouter.put("/updatestatus/:id", _authMiddleware.isSeller, _updateOrderStatus.default);
orderRouter.put("/status/:id", _authMiddleware.isSeller, _orderTrack.default);
orderRouter.post("/create", _order.createOrder);
orderRouter.post("/", _order.buyNowOrder);
orderRouter.get("/list-orders", _order.listOrders);
// seller order
orderRouter.get("/orders", _authMiddleware.isSeller, _sellerOrder.sellerOrders);
orderRouter.get("/:orderId", _authMiddleware.isBuyer, _order.getOrder);
orderRouter.delete("/delete/:id", _authMiddleware.isBuyer, _order.deleteOrder);
orderRouter.put("/update/:id", _authMiddleware.isBuyer, _order.updateOrder);
// //order status tracking
// orderRouter.get("/get/trackorder/:id", isBuyer, getOrderStatus);
// orderRouter.post("/post/trackorder/:id", isSeller, getOrderStatus);

//order status tracking
// orderRouter.get("/get/trackorder/:id", isBuyer, getOrderStatus);
// orderRouter.post("/post/trackorder/:id", isSeller, getOrderStatus);
var _default = orderRouter;
exports.default = _default;