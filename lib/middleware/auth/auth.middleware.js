"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isSeller = exports.isBuyer = exports.isAdmin = exports.checkPermission = void 0;
var _models = _interopRequireDefault(require("../../database/models"));
var _jwt = _interopRequireDefault(require("../../utils/jwt.util"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// This middleware will help in checking a User's role such as 'Admin', 'Seller', 'Buyer'

const User = _models.default.users;
const isAdmin = async (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1]; // assuming the token is sent in the Authorization header
  const {
    uuid
  } = req.params;
  try {
    const decodedToken = _jwt.default.verifyToken(token);
    const user = await User.findOne({
      where: {
        uuid: decodedToken.uuid
      }
    });
    if (user && decodedToken && decodedToken.role === 1) {
      next();
    } else {
      res.status(403).json({
        message: 'Your are Unauthorized to perform this action'
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};
exports.isAdmin = isAdmin;
const isSeller = async (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1]; // assuming the token is sent in the Authorization header
  const {
    uuid
  } = req.params;
  try {
    const decodedToken = _jwt.default.verifyToken(token);
    if (decodedToken.role === 2) {
      next();
    } else {
      res.status(403).json({
        message: 'Your are Unauthorized to perform this action'
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Your are Unauthorized to perform this action'
    });
  }
};
exports.isSeller = isSeller;
const isBuyer = async (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1]; // assuming the token is sent in the Authorization header
  const {
    uuid
  } = req.params;
  try {
    const decodedToken = _jwt.default.verifyToken(token);
    const user = await User.findOne({
      where: {
        uuid: decodedToken.uuid
      }
    });
    if (user && decodedToken && decodedToken.role === 3) {
      next();
    } else {
      res.status(403).json({
        message: 'Your are Unauthorized to perform this action'
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};
exports.isBuyer = isBuyer;
const checkPermission = permission => async (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1]; // assuming the token is sent in the Authorization header
  // const { uuid } = req.params;
  const permissions = {
    1: ['manage users', 'manage products'],
    2: ['manage products'],
    3: ['view products']
  };
  try {
    const decodedToken = _jwt.default.verifyToken(token);
    const user = await User.findOne({
      where: {
        uuid: decodedToken.uuid
      }
    });
    const role = decodedToken?.role;
    if (user && permissions[role]?.includes(permission)) {
      next();
    } else {
      // next();
      res.status(403).json({
        message: 'Your are Unauthorized to perform this action'
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};
exports.checkPermission = checkPermission;