"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
class mailchimp {
  static async send(req, res) {
    const context = {
      verifyUrl: 'mail',
      content: 'View Receipt'
    };
    sendEmail.confirmPayment('ishimwerichard26@gmail.com', 'Payment Confirmation', context);
  }
}
var _default = mailchimp;
exports.default = _default;