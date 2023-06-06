"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _passport = _interopRequireDefault(require("passport"));
var _expressSession = _interopRequireDefault(require("express-session"));
var _cors = _interopRequireDefault(require("cors"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
require('../middleware/auth/passport.auth');
const authRouter = (0, _express.default)();
authRouter.use((0, _cors.default)());
authRouter.use(_express.default.json());
authRouter.use(_express.default.urlencoded({
  extended: true
}));
authRouter.use((0, _expressSession.default)({
  secret: 'melody hensley is my spirit animal',
  resave: false,
  saveUninitialized: true
}));
authRouter.set('view engine', 'ejs');
authRouter.use(_passport.default.initialize());
authRouter.use(_passport.default.session());
authRouter.get('/success', (req, res) => {
  res.status(200).json({
    message: 'You have successfully logged in'
  });
});
authRouter.get('/', (req, res) => {
  res.render('pages/index');
});
authRouter.get('/google', _passport.default.authenticate('google', {
  scope: ['email', 'profile']
}));
authRouter.get('/google/callback', _passport.default.authenticate('google', {
  failureRedirect: '/api/v1/auth/failed'
}), function (req, res) {
  // res.redirect('/api/v1/auth/success');
  res.redirect('https://tech-titans.techsroutine.com');
});
var _default = authRouter;
exports.default = _default;