"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _role = _interopRequireDefault(require("../controllers/user/role.controller"));
var _auth = require("../middleware/auth/auth.middleware");
var _signup = require("../controllers/user/signup.controller");
var _login = _interopRequireDefault(require("../controllers/user/login.controller"));
var _logout = _interopRequireDefault(require("../controllers/user/logout.controller"));
var _forgotPassword = require("../controllers/user/forgotPassword.controller");
var _findAllUsers = _interopRequireDefault(require("../controllers/user/findAllUsers.controller"));
var _profile = _interopRequireDefault(require("../controllers/user/profile.controller"));
var _userEdit = _interopRequireDefault(require("../controllers/user/user.edit.password"));
var _fauthentication = _interopRequireDefault(require("../controllers/user/2fauthentication.controller"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// import roles from './roles.routes';

const userRouter = _express.default.Router();

// Verify user email and then create a new user
userRouter.post('/signup', _signup.verifyUser);
userRouter.get('/signup/:token', _signup.createUser);

// User login and logout
userRouter.post('/login', _login.default);
userRouter.post('/login/verifyOtp', _fauthentication.default);
userRouter.post('/logout', _logout.default);

// Forgot password and reset password
userRouter.patch('/forgot-password', _forgotPassword.forgotPassword);
userRouter.get('/reset-password/:id/:token', _forgotPassword.getResetPassword);
userRouter.post('/reset-password/:id/:token', _forgotPassword.resetPassword);

// Update user profile
userRouter.put('/:uuid', _profile.default);

// Get all users
userRouter.get('/profile/users', _auth.isAdmin, (0, _auth.checkPermission)('manage users'), _findAllUsers.default);
userRouter.post('/role', _auth.isAdmin, (0, _auth.checkPermission)('manage users'), _role.default.setRole);
//update user password
userRouter.put('/editpassword/:uuid', _userEdit.default);
var _default = userRouter;
exports.default = _default;