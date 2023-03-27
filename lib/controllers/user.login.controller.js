"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifyOtp = exports.login = void 0;
var _models = _interopRequireDefault(require("../database/models"));
var _bcrypt = _interopRequireDefault(require("../utils/bcrypt.util"));
var _jwt = _interopRequireDefault(require("../utils/jwt.util"));
var _speakeasy = _interopRequireDefault(require("speakeasy"));
var _send = _interopRequireDefault(require("../utils/send.email"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const User = _models.default.User;
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
    const secret = _speakeasy.default.generateSecret();
    user.mfa_secret = secret.base32;
    await user.save();
    const otp = _speakeasy.default.totp({
      secret: secret.base32,
      encoding: 'base32'
    });
    const to = email;
    const subject = 'your Otp';
    const text = otp;
    _send.default.sendEmail(to, subject, text);
    console.log(`Your one-time code is: ${otp}`);

    // Return a response indicating that the user needs to enter their one-time code
    return res.status(202).json({
      message: 'Please enter your OTP',
      user: {
        id: user.id,
        email: user.email,
        secondFactorEnabled: user.mfa_secret ? true : false
      }
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
exports.login = login;
const verifyOtp = async (req, res) => {
  try {
    const {
      email,
      otp
    } = req.body;
    if (!email || !otp) {
      return res.status(400).json({
        message: 'Please provide both email and OTP'
      });
    }

    // Find the user in the database
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
    if (!isValid) {
      return res.status(401).json({
        message: 'Invalid email or one-time code'
      });
    }

    // Generate a new JWT token and set it as a cookie
    const token = _jwt.default.generateToken({
      id: user.id,
      email: user.email
    }, '1d');
    res.cookie("token", token, {
      httpOnly: true,
      secure: false // cynthia you must remember to set this to true in production(push) and false in dev
    });

    // Send a confirmation email to the user
    // const transporter = nodemailer.createTransport({
    //     host: 'smtp.gmail.com',
    //     port: 587,
    //     auth: {
    //         user: '',
    //         pass: '',
    //     },
    // });
    // const mailOptions = {
    //     from: '',
    //     to: email,
    //     subject: 'Login Successful',
    //     text: 'Your login was successful.',
    // };
    // await transporter.sendMail(mailOptions);

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
exports.verifyOtp = verifyOtp;