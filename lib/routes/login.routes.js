"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _user = require("../controllers/user.controller");
var _express = _interopRequireDefault(require("express"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const loginRouter = _express.default.Router();
loginRouter.post('/', _user.login);
var _default = loginRouter;
exports.default = _default;