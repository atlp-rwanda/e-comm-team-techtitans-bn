"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = require("express");
var _user = _interopRequireDefault(require("./user.routes"));
var _logout = _interopRequireDefault(require("./logout.routes"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const router = (0, _express.Router)();
router.use('/user', _user.default);
router.use('/logout', _logout.default);
var _default = router;
exports.default = _default;