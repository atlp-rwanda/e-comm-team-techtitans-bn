"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _jwt = _interopRequireDefault(require("../../utils/jwt.util"));
var _auth = require("../../middleware/auth/auth.middleware");
var _models = _interopRequireDefault(require("../../database/models"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const {
  getCart
} = require('./cartFunctions');
const User = _models.default.users;
const Product = _models.default.products;
const Cart = _models.default.carts;

// add to cart function
const addToCart = async (req, res) => {
  try {
    const tokenHeader = req.headers.authorization;
    const token = tokenHeader.split(' ')[1];
    const decodedToken = _jwt.default.verifyToken(token);
    const user = await User.findOne({
      where: {
        id: decodedToken.id
      }
    });
    const {
      productId,
      productQuantity
    } = req.body;

    // Check if the user is a buyer
    if (user && decodedToken && decodedToken.roleId === 3) {
      const product = await Product.findByPk(productId);
      if (!product) return res.status(400).json({
        message: 'Product does not exist'
      });
      if (product.quantity < productQuantity) {
        return res.status(400).json({
          message: 'We do not have sufficient products'
        });
      }
      const cart = await getCart(decodedToken.id);
      // if a buyer doesn't have a cart it will be created
      if (!cart) {
        const products = [{
          id: productId,
          name: product.name,
          quantity: productQuantity,
          price: product.price,
          vendorId: product.vendorId,
          total: product.price * productQuantity
        }];
        const newCart = {
          userId: decodedToken.id,
          products,
          total: products.reduce((acc, curr) => acc + curr.total, 0)
        };
        const createdCart = await Cart.create(newCart);
        res.status(201).json({
          message: `${product.name} has been added to your cart`,
          cart: createdCart
        });
      } else {
        // if there is a product in the cart, new products will be added
        const existingProduct = cart.products.find(p => p.id === productId);
        if (existingProduct) {
          existingProduct.quantity += productQuantity;
        } else {
          cart.products.push({
            id: productId,
            name: product.name,
            quantity: productQuantity,
            price: product.price,
            vendorId: product.vendorId,
            total: product.price * productQuantity
          });
        }
        cart.total = cart.products.reduce((acc, curr) => acc + curr.total, 0);
        const updatedCart = await cart.save();
        return res.status(200).json({
          message: `${product.name} has been added to your cart`,
          cart: updatedCart
        });
      }
    } else {
      // if a user is not a buyer
      res.status(401).json({
        error: new Error('User is not a buyer').message,
        message: 'Please create a buyer account'
      });
    }
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: 'Something went wrong while adding product to cart'
    });
  }
};
var _default = addToCart;
exports.default = _default;