"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _bcrypt = _interopRequireDefault(require("bcrypt"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class BcryptUtility {
  static async hashPassword(password) {
    const salt = await _bcrypt.default.genSalt(10);
    return await _bcrypt.default.hash(password, salt);
  }
  static async verifyPassword(password, userPassword) {
    const isValid = await _bcrypt.default.compare(password, userPassword);
    return isValid;
  }
}
var _default = BcryptUtility;
exports.default = _default;