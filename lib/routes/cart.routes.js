"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _addToCart = _interopRequireDefault(require("../controllers/cart/addToCart.controller"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const cartRouter = _express.default.Router();
cartRouter.post('/add-to-cart', _addToCart.default);
var _default = cartRouter;
exports.default = _default;