"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _models = _interopRequireDefault(require("../../database/models"));
var _speakeasy = _interopRequireDefault(require("speakeasy"));
var _jwt = _interopRequireDefault(require("../../utils/jwt.util"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const User = _models.default.users;
const verifyOtp = async (req, res) => {
  try {
    const {
      email,
      otp
    } = req.body;
    if (!email || !otp) {
      return res.status(400).json({
        message: 'Please provide valid OTP/email'
      });
    }
    const user = await User.findOne({
      where: {
        email
      }
    });
    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or OTP'
      });
    }

    // Verify the one-time code
    const secret = user.mfa_secret;
    const isValid = _speakeasy.default.totp.verify({
      secret,
      encoding: 'base32',
      token: otp,
      window: 1
    });
    console.log('isValid', isValid);
    if (!isValid) {
      return res.status(401).json({
        message: 'Invalid one-time code'
      });
    }

    // Generate a new JWT token and set it as a cookie
    const token = _jwt.default.generateToken({
      id: user.id,
      fullname: user.fullname,
      email: user.email,
      roleId: user.roleId
    }, "1y");
    res.cookie('token', token, {
      httpOnly: true,
      secure: true // cynthia you must remember to set this to true in production(push) and false in dev
    });

    // Return a response indicating that the login was successful
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
var _default = verifyOtp;
exports.default = _default;