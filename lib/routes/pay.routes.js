"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _pay = _interopRequireDefault(require("../controllers/user/pay.controller"));
var _auth = require("../middleware/auth/auth.middleware");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const router = _express.default.Router();
router.post('/', _auth.isBuyer, (0, _auth.checkPermission)('make payment'), _pay.default.pay);
var _default = router;
exports.default = _default;