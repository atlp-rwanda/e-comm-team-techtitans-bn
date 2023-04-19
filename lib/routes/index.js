"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = require("express");
var _user = _interopRequireDefault(require("./user.routes"));
var _product = _interopRequireDefault(require("./product.routes"));
var _oauth = _interopRequireDefault(require("./oauth.routes"));
var _pay = _interopRequireDefault(require("./pay.routes"));
var _cart = _interopRequireDefault(require("./cart.routes"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const router = (0, _express.Router)();
router.use('/user', _user.default);
router.use('/', _product.default);
router.use('/cart', _cart.default);
router.use('/auth', _oauth.default);
router.use('/payment', _pay.default);
var _default = router;
exports.default = _default;