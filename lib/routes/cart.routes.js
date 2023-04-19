"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _addToCart = _interopRequireDefault(require("../controllers/cart/addToCart.controller"));
var _authMiddleware = require("../middleware/auth/auth.middleware.js");
var _viewCart = _interopRequireDefault(require("../controllers/cart/viewCart"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const cartRouter = _express.default.Router();
cartRouter.post('/add-to-cart', _addToCart.default);
cartRouter.get('/view-cart', _authMiddleware.isBuyer, _viewCart.default);
var _default = cartRouter;
exports.default = _default;