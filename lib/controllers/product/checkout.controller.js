"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _jwt = _interopRequireDefault(require("../../utils/jwt.util"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class checkout {
  static async check(req, res) {
    const {
      receiverName,
      address,
      phoneNumber,
      shippingMethod,
      orderToken
    } = req.body;
    const decodedToken = _jwt.default.verifyToken(orderToken);
    const amount = decodedToken.total;
    const tokens = _jwt.default.generateToken({
      receiverName,
      address,
      phoneNumber,
      shippingMethod,
      amount
    }, '1y');
    res.status(200).json({
      message: 'Thanks you can now proceed with payments.....',
      data: [receiverName, address, phoneNumber, shippingMethod, amount],
      payToken: tokens
    });
  }
}
var _default = checkout;
exports.default = _default;