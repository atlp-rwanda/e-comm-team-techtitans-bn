"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _jwt = _interopRequireDefault(require("../../utils/jwt.util"));
var _models = _interopRequireDefault(require("../../database/models"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const Cart = _models.default.carts;
const viewCart = async (req, res) => {
  try {
    const tokenHeader = req.headers.authorization;
    const token = tokenHeader.split(" ")[1];
    const decodedToken = _jwt.default.verifyToken(token);
    const cart = await _models.default.Cart.findAll({
      where: {
        userId: decodedToken.id
      }
    });
    if (!cart || cart.length == 0) {
      return res.status(404).json({
        message: "Your cart is empty"
      });
    }
    res.status(200).json({
      message: "Your cart has been retrieved successfully",
      cart
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Sorry, we encountered an error while trying to view your cart."
    });
  }
};
var _default = viewCart;
exports.default = _default;