"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _statistics = _interopRequireDefault(require("../controllers/statistics/statistics.controller"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const statsRouter = _express.default.Router();
statsRouter.get('/check-stats', _statistics.default);
var _default = statsRouter;
exports.default = _default;