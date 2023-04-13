"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _models = _interopRequireDefault(require("../../database/models"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const User = _models.default.users;
const EXPIRATION_TIME = process.env.PASSWORD_EXPIRATION_TIME;
const RestrictPassword = async (req, res, next) => {
  try {
    const uuidRegex = /^[a-f\d]{8}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{12}$/i;
    if (!uuidRegex.test(req.params.uuid)) {
      return res.status(401).json({
        message: "Your Identification number syntax is Invalid"
      });
    }
    const user = await User.findOne({
      where: {
        uuid: req.params.uuid
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