"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _signup = require("../controllers/user/signup.controller");
var _login = _interopRequireDefault(require("../controllers/user/login.controller"));
var _logout = _interopRequireDefault(require("../controllers/user/logout.controller"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const userRouter = _express.default.Router();

// Create a new Tutorial
userRouter.post('/signup', _signup.verifyUser);
userRouter.get('/signup/:token', _signup.createUser);
userRouter.post('/login', _login.default);
userRouter.post('/logout', _logout.default);
var _default = userRouter;
exports.default = _default;