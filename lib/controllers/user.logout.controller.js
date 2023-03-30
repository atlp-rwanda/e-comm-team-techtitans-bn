"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const logoutController = (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({
    message: "Logged out successfully"
  });
};
var _default = logoutController;
exports.default = _default;