"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifyUser = exports.createUser = void 0;
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _models = _interopRequireDefault(require("../../database/models"));
var _bcrypt = _interopRequireDefault(require("../../utils/bcrypt.util"));
var _jwt = _interopRequireDefault(require("../../utils/jwt.util"));
var _response = _interopRequireDefault(require("../../utils/response.util"));
var _send = _interopRequireDefault(require("../../utils/send.email"));
const _excluded = ["password"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
const User = _models.default.users;
// Create and Save a new User
const verifyUser = async (req, res) => {
  try {
    const user = _objectSpread({}, req.body);
    const emailAlreadyExists = await User.findOne({
      where: {
        email: user.email
      }
    });
    if (emailAlreadyExists !== null) {
      res.status(401).json({
        message: "Email already exists"
      });
    } else {
      switch (true) {
        case user.fullname.trim() === "":
          res.status(401).json({
            message: "Please enter your name"
          });
          break;
        case user.email.trim() === "":
          res.status(401).json({
            message: "Email can not be empty"
          });
          break;
        case !/\S+@\S+\.\S+/.test(user.email):
          res.status(401).json({
            message: "Please enter a valid email address."
          });
          break;
        case user.password.trim() === "":
          res.status(401).json({
            message: "Please enter a password."
          });
          break;
        case user.password.trim().length < 8:
          res.status(401).json({
            message: "Your password must be at least 8 characters long."
          });
          break;
        //   case !user.password.match(/^[a-z0-9]+$/i):
        case !user.password.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/i):
          res.status(401).json({
            message: "Your password must contain at least 1 uppercase, 1 lowercase, 1 digit, and one case character."
          });
          break;
        case user.confirmPassword.trim() === "":
          res.status(401).json({
            message: "Please input your password again."
          });
          break;
        case user.password !== user.confirmPassword:
          res.status(401).json({
            message: "Both passwords must match."
          });
          break;
        default:
          // Encrypt the Password
          user.password = await _bcrypt.default.hashPassword(req.body.password);
          const to = user.email;
          const userToken = _jwt.default.generateToken(user, "1h");
          const context = {
            verifyUrl: `${process.env.VERIFICATION_URL}/api/v1/user/signup/${userToken}`,
            content: "VERIFY YOUR EMAIL"
          };
          _send.default.sendVerification(to, "verification email", context);
          _response.default.success(res, 200, "Check your email and proceed with verification", {
            email: user.email,
            userToken
          });
          break;
      }
    }
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
// Create a new user
exports.verifyUser = verifyUser;
const createUser = async (req, res) => {
  const {
    token
  } = req.params;
  const check = _jsonwebtoken.default.verify(token, process.env.SECRET_TOKEN);
  const existUser = await User.findOne({
    where: {
      email: check.email
    }
  });
  if (existUser) {
    res.status(400).send({
      message: "User already VERIFIED"
    });
  } else {
    try {
      const frolink = `https://tech-titans.techsroutine.com/auth/login`;
      return res.redirect(frolink);
    } catch (error) {
      return res.status(500).json({
        message: error.message
      });
    }
  }
  if (!existUser) {
    User.create(check).then(data => {
      const _data$dataValues = data.dataValues,
        {
          password
        } = _data$dataValues,
        rest = _objectWithoutProperties(_data$dataValues, _excluded);
      res.status(201).send({
        message: "check a welcoming message we sent you...",
        data: rest
      });
    }).catch(err => {
      res.status(500).send({
        message: "Internal Server Error"
      });
    });
  }
  const context = {
    verifyUrl: `${process.env.WELCOME_URL}`,
    content: "GET STARTED"
  };
  _send.default.sendWelcome(check.email, "verification email", context);
};
exports.createUser = createUser;