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
var _order = _interopRequireDefault(require("./order.routes"));
var _checkout = _interopRequireDefault(require("./checkout.routes"));
var _chat = _interopRequireDefault(require("./chat.routes"));
var _message = _interopRequireDefault(require("./message.routes"));
var _notification = _interopRequireDefault(require("./notification.routes"));
var _statistics = _interopRequireDefault(require("./statistics.routes"));
var _riview = _interopRequireDefault(require("./riview.routes"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const router = (0, _express.Router)();
router.use('/user', _user.default);
router.use('/', _product.default);
router.use('/cart', _cart.default);
router.use('/auth', _oauth.default);
router.use('/payment', _pay.default);
router.use('/order', _order.default);
router.use('/checkout', _checkout.default);
router.use('/notification', _notification.default);
router.use('/chats', _chat.default);
router.use('/message', _message.default);
router.use('/stats', _statistics.default);
router.use('/review', _riview.default);
var _default = router;
exports.default = _default;