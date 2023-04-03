"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _user = require("../controllers/user.controller");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const userRouter = _express.default.Router();

// Create a new Tutorial

userRouter.post("/signup", _user.verifyUser);
userRouter.get("/signup/:token", _user.createUser);
userRouter.post("/login", _user.login);
userRouter.patch("/forgot-password", _user.forgotPassword);
userRouter.get("/reset-password/:id/:token", _user.getResetPassword);
userRouter.post("/reset-password/:id/:token", _user.resetPassword);
userRouter.put('/:uuid', _user.updateProfile);
userRouter.get('/profile/users', _user.findAllUsers);
var _default = userRouter;
exports.default = _default;