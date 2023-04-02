"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _models = _interopRequireDefault(require("../../database/models"));
var _bcrypt = _interopRequireDefault(require("../../utils/bcrypt.util"));
var _jwt = _interopRequireDefault(require("../../utils/jwt.util"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const User = _models.default.users;
const login = async (req, res) => {
  try {
    const {
      email,
      password
    } = req.body;
    if (!email || !password) {
      return res.status(401).json({
        message: 'Please provide both email and password'
      });
    }
    // Find the email of the user
    const user = await User.findOne({
      where: {
        email
      }
    });
    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }
    // Check if the user password matches
    const passwordMatch = await _bcrypt.default.verifyPassword(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }
    const token = _jwt.default.generateToken({
      id: user.id,
      email: user.email
    }, '1d');

    // Set cookie with the token as its value
    res.cookie('token', token, {
      httpOnly: true,
      secure: true // cynthia you must remember to set this to true in production(push) and false in dev
    });

    res.status(200).json({
      message: 'Login successful',
      token
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
var _default = login;
exports.default = _default;