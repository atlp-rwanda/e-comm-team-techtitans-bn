"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.connectDB = void 0;
var _express = _interopRequireDefault(require("express"));
var _cors = _interopRequireDefault(require("cors"));
var _dotenv = _interopRequireDefault(require("dotenv"));
var _swaggerUiExpress = _interopRequireDefault(require("swagger-ui-express"));
var _index = require("./database/models/index");
var _routes = _interopRequireDefault(require("./routes"));
var _index2 = _interopRequireDefault(require("../docs/index"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// import db from './database/models/index';

_dotenv.default.config();
const app = (0, _express.default)();
app.use((0, _cors.default)());
app.use(_express.default.json());
app.use(_express.default.urlencoded({
  extended: true
}));
app.get('/', (req, res) => {
  res.status(200).send(`<h1 style='text-align: center; color: #CCD6F6; margin-top: 20vh; background: #0A192F; padding: 150px;'>Welcome to team Tech-Titans's E-commerce API!</h1>`);
});
const connectDB = async () => {
  try {
    // await sequelize.sync({ force: true });
    await _index.sequelize.sync();
    console.log('🟢 Database connection established successfully');
  } catch (err) {
    console.log(`Database connection failed: ${err}`);
    process.exit(1);
  }
};
exports.connectDB = connectDB;
app.use('/api-docs', _swaggerUiExpress.default.serve, _swaggerUiExpress.default.setup(_index2.default));
app.use('/api/v1', _routes.default);
var _default = app;
exports.default = _default;