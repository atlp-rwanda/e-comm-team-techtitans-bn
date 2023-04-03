"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifyUser = exports.updateProfile = exports.resetPassword = exports.login = exports.getResetPassword = exports.forgotPassword = exports.findAllUsers = exports.deleteAllUsers = exports.createUser = void 0;
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _models = _interopRequireDefault(require("../database/models"));
var _bcrypt = _interopRequireDefault(require("../utils/bcrypt.util"));
var _jwt = _interopRequireDefault(require("../utils/jwt.util"));
var _response = _interopRequireDefault(require("../utils/response.util"));
var _send = _interopRequireDefault(require("../utils/send.email"));
var _resetPasswordEmail = _interopRequireDefault(require("../utils/resetPasswordEmail"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
const User = _models.default.users;
const resetSecret = process.env.RESET_SECRET;
const bcrypt = require("bcrypt");
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
            verifyUrl: `http://localhost:${process.env.PORT}/api/v1/user/signup/${userToken}`,
            content: "VERIFY YOUR EMAIL"
          };
          _send.default.sendVerification(to, "verification email", context);
          _response.default.success(res, 200, "Check your email and proceed with verification", {
            email: user.email,
            password: user.password,
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
  User.create(check).then(data => {
    res.status(201).json({
      data: data,
      message: "check a welcoming message we sent you..."
    });
  }).catch(err => {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the User."
    });
  });
  const context = {
    verifyUrl: `http://localhost:${process.env.PORT}`,
    content: "GET STARTED"
  };
  _send.default.sendWelcome(check.email, "verification email", context);
};

// Find all Users
exports.createUser = createUser;
const findAllUsers = (req, res) => {
  User.findAll({
    where: {}
  }).then(usersList => {
    res.send({
      message: `${usersList.length} Users were all fetched successfully!`,
      data: usersList
    });
  }).catch(err => {
    res.status(500).send({
      message: err.message || "Some error occurred while removing all users."
    });
  });
};
// Delete all Users
exports.findAllUsers = findAllUsers;
const deleteAllUsers = (req, res) => {
  User.destroy({
    where: {},
    truncate: false
  }).then(nums => {
    res.send({
      message: `${nums} Users were all deleted successfully!`
    });
  }).catch(err => {
    res.status(500).send({
      message: err.message || "Some error occurred while removing all users."
    });
  });
};
exports.deleteAllUsers = deleteAllUsers;
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
    // Check if the user password matches
    const passwordMatch = await _bcrypt.default.verifyPassword(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }
    const token = _jwt.default.generateToken({
      id: user.id,
      email: user.email
    }, "1d");

    // Set cookie with the token as its value
    res.cookie("token", token, {
      httpOnly: true,
      secure: true // cynthia you must remember to set this to true in production(push) and false in dev
    });

    res.status(200).json({
      message: "Login successful",
      token
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

//FORGOT PASSWORD
exports.login = login;
const forgotPassword = async (req, res) => {
  const {
    email
  } = req.body;
  try {
    //look for email in database
    const user = await User.findOne({
      where: {
        email
      }
    });
    if (!user) {
      res.status(404).json({
        error: "Invalid Email"
      });
    } else {
      // res.status(200).json({message:'User exist'})

      const token = _jsonwebtoken.default.sign({
        user: user.email
      }, resetSecret, {
        expiresIn: "10m"
      });
      const link = `http://localhost:${process.env.PORT}/api/v1/user/reset-password/${user.id}/${token}`;
      (0, _resetPasswordEmail.default)(user, link);
      res.status(201).json({
        message: "Password reset Link has been send to your email ...."
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
exports.forgotPassword = forgotPassword;
const getResetPassword = async (req, res) => {
  const {
    id,
    token
  } = req.params;
  //check if id exist
  const user = await User.findOne({
    where: {
      id
    }
  });
  if (!user) {
    return res.status(404).json({
      error: "user not exist"
    });
  } else {
    try {
      const payload = _jsonwebtoken.default.verify(token, resetSecret);
      return res.send({
        email: user.email
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message
      });
    }
  }
};
exports.getResetPassword = getResetPassword;
const resetPassword = async (req, res) => {
  const {
    id,
    token
  } = req.params;
  const {
    password,
    confirmPassword
  } = req.body;
  //check if id exist
  const user = await User.findOne({
    where: {
      id
    }
  });
  if (!user) {
    return res.status(404).json({
      error: "user not exist"
    });
  } else {
    try {
      const payload = _jsonwebtoken.default.verify(token, resetSecret);
      switch (true) {
        case password.trim() === "":
          res.status(401).json({
            message: "Please enter a password."
          });
          break;
        case password.trim().length < 8:
          res.status(401).json({
            message: "Your password must be at least 8 characters long."
          });
          break;
        //   case !user.password.match(/^[a-z0-9]+$/i):
        case !password.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/i):
          res.status(401).json({
            message: "Your password must contain at least 1 uppercase, 1 lowercase, 1 digit, and one case character."
          });
          break;
        case confirmPassword.trim() === "":
          res.status(401).json({
            message: "Please input your password again."
          });
          break;
        case password !== confirmPassword:
          res.status(401).json({
            message: "Both passwords must match."
          });
          break;
        default:
          try {
            const _payload = _jsonwebtoken.default.verify(token, resetSecret);
            // user.password = password;
            User.findOne({
              where: {
                id
              }
            }).then(user => {
              user.password = bcrypt.hashSync(password, 10);
              return user.save();
            }).then(data => {
              return res.status(200).json({
                message: "Password successfuly reset",
                data: data
              });
            });
          } catch (error) {
            res.status(500).json({
              message: error.message
            });
          }
      }
    } catch (error) {
      return res.status(500).json({
        message: error.message
      });
    }
  }
};
// update a profile
exports.resetPassword = resetPassword;
const updateProfile = async (req, res) => {
  const {
    uuid
  } = req.params;
  const {
    gender,
    birthdate,
    preferredLanguage,
    preferredCurrency,
    location,
    billingAddress
  } = req.body;
  try {
    const user = await User.findOne({
      where: {
        uuid
      }
    });
    user.gender = gender;
    user.birthdate = birthdate;
    user.preferredLanguage = preferredLanguage;
    user.preferredCurrency = preferredCurrency;
    user.location = location;
    user.billingAddress = billingAddress;
    await user.save();
    return res.status(201).json({
      user: {
        gender: user.gender,
        birthdate: user.birthdate,
        preferredLanguage: user.preferredLanguage,
        preferredCurrency: user.preferredCurrency,
        location: user.location,
        billingAddress: user.billingAddress
      }
    });
  } catch (error) {
    return res.status(500).json({
      error: "Server error"
    });
  }
};
exports.updateProfile = updateProfile;