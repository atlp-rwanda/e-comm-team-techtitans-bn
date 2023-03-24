"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _cors = _interopRequireDefault(require("cors"));
var _dotenv = _interopRequireDefault(require("dotenv"));
var _swaggerUiExpress = _interopRequireDefault(require("swagger-ui-express"));
var _index = _interopRequireDefault(require("../docs/index.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
_dotenv.default.config();
const {
  PORT
} = process.env;
const app = (0, _express.default)();
app.use((0, _cors.default)());
app.use(_express.default.json());
app.use(_express.default.urlencoded({
  extended: true
}));
app.get('/', (req, res) => {
  res.status(200).send({
    status: 200,
    success: true,
    message: `Welcome to team Tech-Titans's API! Endpoints available at http://localhost:${PORT}/api/v1 + the endpoint you want to hit`
  });
});
app.use('/api-docs', _swaggerUiExpress.default.serve, _swaggerUiExpress.default.setup(_index.default));
var _default = app;
exports.default = _default;