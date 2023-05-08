"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _updateOrderStatus = _interopRequireDefault(require("../controllers/order/updateOrderStatus.controller"));
var _orderStatusTrack = _interopRequireDefault(require("../controllers/order/order.status.track.controller"));
var _order = require("../controllers/order/order.controller");
var _authMiddleware = require("../middleware/auth/auth.middleware.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const orderRouter = _express.default.Router();
//1. sellers update order status from "pending"to "shipped"
orderRouter.put("/updatestatus/:id", _authMiddleware.isSeller, _updateOrderStatus.default);
orderRouter.post("/create", _authMiddleware.isBuyer, _order.createOrder);
orderRouter.post("/", _authMiddleware.isBuyer, _order.buyNowOrder);
orderRouter.get("/list-orders", _authMiddleware.isBuyer, _order.listOrders);
orderRouter.get("/:id", _authMiddleware.isBuyer, _order.getOrder);
orderRouter.delete("/delete/:id", _authMiddleware.isBuyer, _order.deleteOrder);
orderRouter.put("/update/:id", _authMiddleware.isBuyer, _order.updateOrder);
var _default = orderRouter; //order status tracking
exports.default = _default;
orderRouter.get('/get/trackorder/:id', _authMiddleware.isBuyer, _orderStatusTrack.default);
orderRouter.post('/post/trackorder/:id', _authMiddleware.isSeller, _orderStatusTrack.default);