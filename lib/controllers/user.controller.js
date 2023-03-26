"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifyUser = exports.findAllUsers = exports.deleteAllUsers = exports.createUser = void 0;
var _models = _interopRequireDefault(require("../database/models"));
var _bcrypt = _interopRequireDefault(require("../utils/bcrypt.util"));
var _jwt = _interopRequireDefault(require("../utils/jwt.util"));
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
const User = _models.default.users;
// const { Op } = db.Sequelize.Op;

// Create and Save a new User
const verifyUser = async (req, res) => {
  try {
    const user = _objectSpread({}, req.body);
    switch (true) {
      case user.fullname.trim() === '':
        res.status(401).json({
          message: 'Please enter your name'
        });
        break;
      case user.email.trim() === '':
        res.status(401).json({
          message: 'Email can not be empty'
        });
        break;
      case !/\S+@\S+\.\S+/.test(user.email):
        res.status(401).json({
          message: 'Please enter a valid email address.'
        });
        break;
      case user.password.trim() === '':
        res.status(401).json({
          message: 'Please enter a password.'
        });
        break;
      case user.password.trim().length < 8:
        res.status(401).json({
          message: 'Your password must be at least 8 characters long.'
        });
        break;
      //   case !user.password.match(/^[a-z0-9]+$/i):
      case !user.password.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/i):
        res.status(401).json({
          message: 'Your password must contain at least 1 uppercase, 1 lowercase, 1 digit, and one case character.'
        });
        break;
      case user.confirmPassword.trim() === '':
        res.status(401).json({
          message: 'Please input your password again.'
        });
        break;
      case user.password !== user.confirmPassword:
        res.status(401).json({
          message: 'Both passwords must match.'
        });
        break;
      default:
        user.password = await _bcrypt.default.hashPassword(req.body.password);
        // Save user in the database
        const userToken = _jwt.default.generateToken(user, '1h');

        // Redirect to another route
        const redirectUrl = `http://localhost:3000/api/v1/user/${userToken}`;
        // res.redirect(redirectUrl);
        res.json(redirectUrl);
        break;
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
  const userDetails = _objectSpread({}, req.body);
  User.create(check).then(data => {
    res.status(200).json({
      message: `User ${userDetails.fullname} successfully created`,
      data
    });
  }).catch(err => {
    res.status(500).send({
      message: err.message || 'Some error occurred while creating the User.'
    });
  });
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
      message: err.message || 'Some error occurred while removing all users.'
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
      message: err.message || 'Some error occurred while removing all users.'
    });
  });
};

// import db from '../database/models';
// import BcryptUtility from '../utils/bcrypt.util';
// import JwtUtility from '../utils/jwt.util';
// import jwt from 'jsonwebtoken';

// const User = db.users;
// // const { Op } = db.Sequelize.Op;

// // Create and Save a new User
// const verifyUser = async (req, res) => {
//   try {
//     const user = {
//       ...req.body,
//     };
//     user.password = await BcryptUtility.hashPassword(req.body.password);
//     // Save user in the database
//     const userToken = JwtUtility.generateToken(user, '1h');

//     //! Redirect to another route
//     const redirectUrl = `http://localhost:3000/api/v1/user/${userToken}`;
//     // res.redirect(redirectUrl);
//     res.json(redirectUrl);
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };
// const createUser = async (req, res) => {
//   const { token } = req.params;
//   const check = jwt.verify(token, process.env.SECRET_TOKEN);

//   User.create(check)
//     .then((data) => {
//       res.status(200).json({
//         message: `User ${data.fullname} successfully created`,
//         data,
//       });
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message: err.message || 'Some error occurred while creating the User.',
//       });
//     });
// };

// // Find all Users
// const findAllUsers = (req, res) => {
//   User.findAll({ where: {} })
//     .then((usersList) => {
//       res.send({
//         message: `${usersList.length} Users were all fetched successfully!`,
//         data: usersList,
//       });
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message: err.message || 'Some error occurred while removing all users.',
//       });
//     });
// };
// // Delete all Users
// const deleteAllUsers = (req, res) => {
//   User.destroy({
//     where: {},
//     truncate: false,
//   })
//     .then((nums) => {
//       res.send({ message: `${nums} Users were all deleted successfully!` });
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message: err.message || 'Some error occurred while removing all users.',
//       });
//     });
// };

// export { verifyUser, createUser, deleteAllUsers, findAllUsers };
exports.deleteAllUsers = deleteAllUsers;