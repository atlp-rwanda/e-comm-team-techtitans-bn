"use strict";

var _passport = _interopRequireDefault(require("passport"));
var _passportGoogleOauth = require("passport-google-oauth2");
var _bcrypt = _interopRequireDefault(require("../../utils/bcrypt.util"));
var _models = _interopRequireDefault(require("../../database/models"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* eslint-disable prefer-arrow-callback */

// eslint-disable-next-line import/no-extraneous-dependencies

const User = _models.default.users;
const generatePassword = () => {
  const length = 8;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let password = '';
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};
_passport.default.use(new _passportGoogleOauth.Strategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:8000/api/v1/auth/google/callback',
  passReqToCallback: true
}, async function (request, accessToken, refreshToken, profile, done) {
  try {
    const user = await User.findOne({
      where: {
        email: profile.email
      }
    });
    if (!user) {
      const password = generatePassword();
      const hashedPassword = await _bcrypt.default.hashPassword(password);
      const newUser = {
        fullname: `${profile.given_name} ${profile.family_name}`,
        email: profile.email,
        password: profile.password || hashedPassword
      };
      const theGoogleUser = await User.create(newUser);
      done(null, theGoogleUser);
    } else {
      done(null, user);
    }
  } catch (error) {
    done(error, null);
  }
}));
_passport.default.serializeUser((user, done) => {
  done(null, user);
});
_passport.default.deserializeUser((user, done) => {
  done(null, user);
});