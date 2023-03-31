"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.connectDB = void 0;
var _express = _interopRequireDefault(require("express"));
var _cors = _interopRequireDefault(require("cors"));
var _dotenv = _interopRequireDefault(require("dotenv"));
var _swaggerUiExpress = _interopRequireDefault(require("swagger-ui-express"));
var _passport = _interopRequireDefault(require("passport"));
var _expressSession = _interopRequireDefault(require("express-session"));
var _index = require("./database/models/index");
var _routes = _interopRequireDefault(require("./routes"));
var _index2 = _interopRequireDefault(require("../docs/index"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// import db from './database/models/index';

require('./middleware/auth/passport-setup');
_dotenv.default.config();
const app = (0, _express.default)();
app.use((0, _cors.default)());
app.use(_express.default.json());
app.use(_express.default.urlencoded({
  extended: true
}));

//! ************CHANGES BELOW************

// app.use(session({ secret: 'cats' }));
// app.use(passport.initialize());
// app.use(passport.session());

// function isLoggedIn(req, res, next) {
//   req.user ? next() : res.sendStatus(401);
// }

// app.get('/', (req, res) => {
//   res.status(200).send(`<a href='/auth/google'>Authenticate with Google</a>`);
// });

// app.get('/auth/google', (req, res) => {
//   passport.authenticate('google', { scope: ['email', 'profile'] });
// });

// app.get('/google/callback', (req, res) => {
//   passport.authenticate('google', {
//     successRedirect: '/protected',
//     failureRedirect: '/auth/failure',
//   });
// });

// app.get('/auth/failure', (req, res) => {
//   res.send('🛑 Something went wrong...');
// });

// app.get('/protected', isLoggedIn, (req, res) => {
//   res.send('Hello!');
// });

// ! ***//***
app.use((0, _expressSession.default)({
  secret: 'melody hensley is my spirit animal'
}));
require('./middleware/auth/passport-setup');
app.set('view engine', 'ejs');
app.use(_passport.default.initialize());
app.use(_passport.default.session());
app.get('/', (req, res) => {
  res.render('pages/index');
});
app.get('/success', (req, res) => {
  res.render('pages/profile.ejs', {
    name: req.user.displayName,
    email: req.user.emails[0].value,
    pic: req.user.photos[0].value
  });
});
app.get('/google', _passport.default.authenticate('google', {
  scope: ['email', 'profile']
}));
app.get('/google/callback', _passport.default.authenticate('google', {
  failureRedirect: '/failed'
}), function (req, res) {
  res.redirect('/success');
});

//! ************CHANGES ABOVE************

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