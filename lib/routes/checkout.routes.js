"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _checkout = _interopRequireDefault(require("../controllers/product/checkout.controller"));
var _auth = require("../middleware/auth/auth.middleware");
var _checkPassword = _interopRequireDefault(require("../middleware/auth/check.password.update"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const router = _express.default.Router();
router.post('/', _checkout.default.check);
// router.get('/', RestrictPassword, isBuyer, checkPermission('make payment'), checkout.check);
var _default = router;
exports.default = _default;