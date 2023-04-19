"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _models = _interopRequireDefault(require("../../database/models"));
var _jwt = _interopRequireDefault(require("../../utils/jwt.util"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const User = _models.default.users;
const EXPIRATION_TIME = process.env.PASSWORD_EXPIRATION_TIME;
const RestrictPassword = async (req, res, next) => {
  const tokenHeader = req.headers.authorization;
  if (!tokenHeader) {
    return res.status(401).json({
      message: 'Token not provided'
    });
  }
  const token = tokenHeader.split(" ")[1];
  try {
    const decodedToken = _jwt.default.verifyToken(token);
    const user = await User.findOne({
      where: {
        id: decodedToken.id
      }
    });
    if (!user) {
      return res.status(401).json({
        message: "Your Identification is Invalid"
      });
    }
    const lastPasswordUpdate = user.lastPasswordUpdate || user.createdAt;
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() - EXPIRATION_TIME);
    if (lastPasswordUpdate < expirationDate) {
      return res.status(401).json({
        message: 'Please update your password'
      });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'server error'
    });
  }
};
var _default = RestrictPassword;
exports.default = _default;