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
var _findOneUser = _interopRequireDefault(require("../controllers/user/findOneUser.controller"));
var _profile = require("../controllers/user/profile.controller");
var _userEdit = _interopRequireDefault(require("../controllers/user/user.edit.password"));
var _fauthentication = _interopRequireDefault(require("../controllers/user/2fauthentication.controller"));
var _checkPassword = _interopRequireDefault(require("../middleware/auth/check.password.update"));
var _disableEnableUsers = _interopRequireDefault(require("../controllers/user/disableEnableUsers.controller"));
var _userSearch = require("../controllers/user/userSearch.controller");
var _signup2 = require("../controllers/subscriber/signup.controller");
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
// userRouter.patch("/forgot-password", forgotPassword);
userRouter.patch('/forgot-password', _forgotPassword.forgotPassword);
userRouter.get('/reset-password/:id/:token', _forgotPassword.getResetPassword);
// userRouter.post('/reset-password/:id/:token', resetPassword);
userRouter.post('/reset-password/:id', _forgotPassword.resetPassword);

// Update user profile
userRouter.put('/profile', _profile.updateProfile);
userRouter.get("/for/only/profiles", _profile.getProfile);

//find one user
userRouter.get('/profile/user/:id', _findOneUser.default);
userRouter.get("/profile/users", _auth.isAdmin, (0, _auth.checkPermission)("manage users"), _findAllUsers.default);
userRouter.put('/role/:id', _auth.isAdmin, (0, _auth.checkPermission)("manage users"), _role.default.setRole);

// update user password
userRouter.put('/editpassword/:id', _userEdit.default);
// disable and enable user account

userRouter.put('/updateAccountStatus/:id', _auth.isAdmin, (0, _auth.checkPermission)('manage users'), _disableEnableUsers.default);
userRouter.get('/search', _userSearch.searchForUsers);
userRouter.post('/subscriber', _signup2.verifySubscriber);
userRouter.get('/subscriber/:token', _signup2.createSubscriber);
userRouter.patch('/subscriber/:id', _signup2.updateSubscriber);
userRouter.get('/subscriber/delete/:id', _signup2.deleteSubscriber);
var _default = userRouter;
exports.default = _default;