"use strict";

var _app = _interopRequireDefault(require("./app"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const {
  PORT
} = process.env;
_app.default.listen(PORT, () => {
  console.log(`🍏 Server is running on: http://localhost:${PORT} ... 🌊`);
});