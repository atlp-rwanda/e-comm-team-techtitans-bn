"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _userLogin = require("../controllers/user.login.controller");
var _express = _interopRequireDefault(require("express"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const loginRouter = _express.default.Router();
loginRouter.post('/', _userLogin.login);
var _default = loginRouter;
exports.default = _default;