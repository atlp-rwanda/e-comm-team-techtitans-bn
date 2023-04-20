"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _updateOrderStatus = _interopRequireDefault(require("../controllers/order/updateOrderStatus.controller"));
var _authMiddleware = require("../middleware/auth/auth.middleware.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const orderRouter = _express.default.Router();
//1. sellers update order status from "pending"to "shipped"
orderRouter.put('/updatestatus/:uuid', _authMiddleware.isSeller, _updateOrderStatus.default);
var _default = orderRouter;
exports.default = _default;