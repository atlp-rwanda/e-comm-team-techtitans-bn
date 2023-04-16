"use strict";

var _models = _interopRequireDefault(require("../../database/models"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const User = _models.default.users;
const Product = _models.default.products;
const Cart = _models.default.carts;
const viewCart = async (req, res) => {
  const user = await User.findOne({
    where: {
      email: req.user.email
    }
  });
  const cart = await Cart.findAll({
    where: {
      userId: user.id
    }
  });
  const products = await Product.findAll();
  const cartProducts = [];
  cart.forEach(cartItem => {
    products.forEach(product => {
      if (cartItem.productId === product.id) {
        cartProducts.push(product);
      }
    });
    res.status(200).json({
      message: 'Cart retrieved successfully',
      cartProducts
    });
  });
};