"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _dotenv = _interopRequireDefault(require("dotenv"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
_dotenv.default.config();
class JwtUtility {
  static generateToken(userData, exp) {
    return _jsonwebtoken.default.sign(userData, process.env.SECRET_TOKEN, {
      expiresIn: exp
    });
  }
  static verifyToken(token) {
    return _jsonwebtoken.default.verify(token, process.env.SECRET_TOKEN, (err, decoded) => {
      if (err) {
        return err;
      }
      return decoded;
    });
  }
}
var _default = JwtUtility;
exports.default = _default;