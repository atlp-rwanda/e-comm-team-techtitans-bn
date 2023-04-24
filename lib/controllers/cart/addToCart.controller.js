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
  getCart,
  updateCart
} = require('./cartFunction');
const User = _models.default.users;
const Cart = _models.default.carts;

// add to cart function
const addItemToCart = async (req, res) => {
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
    if (!user || !decodedToken || decodedToken.roleId !== 3) {
      // If a user is not a buyer.
      return res.status(401).json({
        error: new Error('User is not a buyer').message,
        message: 'Please create a buyer account'
      });
    }
    const product = await _models.default.Product.findByPk(productId);
    if (!product) {
      // If a product is not in the database
      return res.status(400).json({
        message: 'Product does not exist'
      });
    }
    if (product.quantity < productQuantity) {
      // If a buyer chooses more than what exists.
      return res.status(400).json({
        message: 'We do not have sufficient products'
      });
    }
    let cart = await getCart(decodedToken.id);
    const products = cart ? cart.products : [];
    const existingProduct = products.find(p => p.id === productId);
    if (existingProduct) {
      existingProduct.quantity += productQuantity;
    } else {
      const newProduct = {
        id: productId,
        name: product.name,
        quantity: productQuantity,
        price: product.price,
        images: product.images,
        total: product.price * productQuantity
      };
      products.push(newProduct);
    }
    const total = products.reduce((acc, curr) => acc + curr.total, 0);
    if (!cart) {
      // If the cart doesn't exist
      cart = await Cart.create({
        userId: decodedToken.id,
        products,
        total
      });
    } else {
      // If the cart existed, it will be updated
      await updateCart({
        products,
        total
      }, cart.id);
    }
    return res.status(201).json({
      message: `${product.name} has been added to your cart`,
      cart: {
        products,
        total
      }
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: 'Sorry, we encountered an error while trying to add the product to your cart.'
    });
  }
};
var _default = addItemToCart;
exports.default = _default;