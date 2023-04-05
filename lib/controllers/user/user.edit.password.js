"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _models = _interopRequireDefault(require("../../database/models"));
var _bcrypt = _interopRequireDefault(require("../../utils/bcrypt.util"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
const User = _models.default.users;
const editPassword = async (req, res) => {
  const {
    uuid
  } = req.params;
  try {
    const user = _objectSpread({}, req.body);
    if (!user.old_password || !user.new_password || !user.confirm_password) {
      console.log(user.new_password);
      return res.status(401).json({
        message: 'Please fill in the old password and new password'
      });
    }
    // Find the user
    const Logged = await User.findOne({
      where: {
        uuid
      }
    });
    if (!Logged) {
      return res.status(401).json({
        message: 'no user with such id'
      });
    }
    // Check if the user password matches
    const passwordMatch = await _bcrypt.default.verifyPassword(user.old_password, Logged.password);
    if (!passwordMatch) {
      return res.status(401).json({
        message: 'Your old password is not correct'
      });
    } else {
      if (!user.new_password.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/i)) {
        res.status(401).json({
          message: 'Your password must contain at least 1 uppercase, 1 lowercase, 1 digit, and one case character.'
        });
      }
      //update the password
      else if (user.new_password !== user.confirm_password) {
        return res.status(500).json({
          message: 'your new password does not match'
        });
      } else {
        Logged.password = await _bcrypt.default.hashPassword(user.new_password);
        await Logged.save();
        return res.status(200).json({
          message: 'your password was edited sucessfully'
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
var _default = editPassword;
exports.default = _default;