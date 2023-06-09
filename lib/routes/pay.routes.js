"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _pay = _interopRequireDefault(require("../controllers/user/pay.controller"));
var _auth = require("../middleware/auth/auth.middleware");
var _checkPassword = _interopRequireDefault(require("../middleware/auth/check.password.update"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const router = _express.default.Router();
router.post('/:payToken', _pay.default.pay);
// router.post('/', RestrictPassword, isBuyer, checkPermission('make payment'), payments.pay);
var _default = router;
exports.default = _default;