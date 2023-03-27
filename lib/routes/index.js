"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = require("express");
var _user = _interopRequireDefault(require("./user.routes"));
var _login = _interopRequireDefault(require("./login.routes"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const router = (0, _express.Router)();
router.use('/user', _user.default);
router.use('/login', _login.default);
var _default = router;
exports.default = _default;