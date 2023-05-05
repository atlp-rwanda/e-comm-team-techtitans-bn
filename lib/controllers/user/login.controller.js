"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _models = _interopRequireDefault(require("../../database/models"));
var _bcrypt = _interopRequireDefault(require("../../utils/bcrypt.util"));
var _jwt = _interopRequireDefault(require("../../utils/jwt.util"));
var _send = _interopRequireDefault(require("../../utils/send.email"));
var _speakeasy = _interopRequireDefault(require("speakeasy"));
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
        message: "Please provide both email and password"
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
        message: "Invalid email or password"
      });
    }
    //check if account is not disbaled
    if (user.accountStatus === "inactive") {
      return res.status(400).json({
        message: "Your Account has been Disabled! Please contact Service manager"
      });
    }
    // Check if the user password matches
    const passwordMatch = await _bcrypt.default.verifyPassword(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }
    const secret = _speakeasy.default.generateSecret();
    if (user.roleId == 3) {
      const token = _jwt.default.generateToken({
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        roleId: user.roleId
      }, "100y");
      res.cookie("token", token, {
        httpOnly: true,
        secure: true // cynthia you must remember to set this to true in production(push) and false in dev
      });

      // Return a response indicating that the login was successful
      return res.status(200).json({
        message: "Login successful",
        token
      });
    } else {
      console.log(user);
      user.mfa_secret = secret.base32;
      await user.save();
      const otp = _speakeasy.default.totp({
        secret: secret.base32,
        encoding: "base32"
      });
      const to = email;
      const subject = "Your OTP";
      const context = {
        otp
      };
      _send.default.sendEmail(to, subject, context);
      console.log(`Your one-time code is: ${otp}`);

      // Return a response indicating that the user needs to enter their one-time code
      return res.status(202).json({
        message: "Please enter your OTP",
        user: {
          id: user.id,
          email: user.email,
          secondFactorEnabled: user.mfa_secret ? true : false
        }
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
var _default = login;
exports.default = _default;