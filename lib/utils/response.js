"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
class response {
  static success(res, status, message, data) {
    res.status(status).send({
      message,
      data
    });
  }
}
var _default = response;
exports.default = _default;