"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCartProducts = exports.getCart = exports.findProductById = void 0;
var _models = _interopRequireDefault(require("../../database/models"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// import { Cart } from '../../database/models';

const Cart = _models.default.carts;
const findProductById = async id => Products.findByPk(id);
// get one cart
exports.findProductById = findProductById;
const getCart = async userId => Cart.findOne({
  where: {
    userId: userId
  }
});
// find the products to add in the cart
exports.getCart = getCart;
const getCartProducts = async products => Promise.all(products.map(async product => findProductById(product)));
exports.getCartProducts = getCartProducts;