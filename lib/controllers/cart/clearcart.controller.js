"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _models = _interopRequireDefault(require("../../database/models"));
var _jwt = _interopRequireDefault(require("../../utils/jwt.util"));
var _auth = require("../../middleware/auth/auth.middleware");
var _sequelize = require("sequelize");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const {
  getCart
} = require('./cartFunction');
const User = _models.default.users;
const Product = _models.default.products;
const Cart = _models.default.carts;

//function to delete the cart
const clearCart = async (req, res) => {
  try {
    const tokenHeader = req.headers.authorization;
    const token = tokenHeader.split(' ')[1];
    const decodedToken = _jwt.default.verifyToken(token);
    const user = await User.findOne({
      where: {
        id: decodedToken.id
      }
    });
    if (user && decodedToken && decodedToken.roleId === 3) {
      const {
        id
      } = req.params;
      if (id !== decodedToken.id) {
        return res.status(401).json({
          status: "fail",
          message: "🚫 Sorry, You are unauthorised to perform action .."
        });
      }
      const availableCart = await _models.default.Cart.findOne({
        where: {
          userId: id
        }
      });
      if (!availableCart) {
        return res.status(404).json({
          status: "fail",
          message: "🚫 Sorry, this cart was not found..."
        });
      } else {
        await availableCart.destroy();
        res.status(200).json({
          status: "success",
          message: `🍀 This Cart is cleared`
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      ror: error.message,
      message: 'Sorry, we encountered an error while trying to delete your cart.'
    });
  }
  ;
};
var _default = clearCart;
exports.default = _default;