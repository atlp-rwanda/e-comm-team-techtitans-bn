"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _models = _interopRequireDefault(require("../../database/models"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const Cart = _models.default.carts;
const User = _models.default.users;
const Product = _models.default.products;

// clear cart function
const clearCart = async (req, res) => {
  try {
    const productId = req.body.productId;
    const availableCart = await models.Cart.findOne({
      where: {
        id: productId
      }
    });
    if (availableCart == null) {
      res.status(400).json({
        status: "fail",
        message: "🚫 Sorry, cart was not found..."
      });
    } else {
      await availableCart.deleteAll();
      res.status(200).json({
        status: "success",
        message: `🍀 Your cart is cleared successfully`
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message
    });
  }
};
var _default = clearCart;
exports.default = _default;