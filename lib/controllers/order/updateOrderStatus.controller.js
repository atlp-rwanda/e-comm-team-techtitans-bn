"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _models = _interopRequireDefault(require("../../database/models"));
var _notifications = require("../notification/notifications.controller");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const OrderStatus = async (req, res) => {
  const {
    id
  } = req.params;
  try {
    // Find the order
    const order = await _models.default.Order.findOne({
      where: {
        id
      }
    });
    if (!order) {
      return res.status(401).json({
        message: "no order with such id"
      });
    }
    // Change order status
    else {
      const updatedOrder = await order.update({
        status: "shipped"
      });
      res.status(200).json({
        status: "success",
        message: "🍀 The order has been marked shipped sucessfully.",
        data: updatedOrder
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
var _default = OrderStatus;
exports.default = _default;