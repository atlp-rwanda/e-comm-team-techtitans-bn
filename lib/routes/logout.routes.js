"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _userLogout = _interopRequireDefault(require("../controllers/user.logout.controller"));
var _express = _interopRequireDefault(require("express"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const logoutRouter = _express.default.Router();
logoutRouter.post("/", _userLogout.default);
var _default = logoutRouter;
exports.default = _default;