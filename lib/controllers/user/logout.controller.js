"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const logout = (req, res) => {
  res.clearCookie('token');
  return res.status(200).json({
    message: 'Logged out successfully'
  });
};
var _default = logout;
exports.default = _default;