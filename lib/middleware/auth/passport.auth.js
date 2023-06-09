"use strict";

var _passport = _interopRequireDefault(require("passport"));
var _passportGoogleOauth = require("passport-google-oauth2");
var _cookie = _interopRequireDefault(require("cookie"));
var _bcrypt = _interopRequireDefault(require("../../utils/bcrypt.util"));
var _jwt = _interopRequireDefault(require("../../utils/jwt.util"));
var _models = _interopRequireDefault(require("../../database/models"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* eslint-disable prefer-arrow-callback */

// eslint-disable-next-line import/no-extraneous-dependencies

// import {response} from "express";
// const response = require('express');
const User = _models.default.users;
const secret = process.env.COOKIE_SECRET;
let token = '';
const generatePassword = () => {
  const l = 8;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let password = '';
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < l; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.l));
  }
  return password;
};
_passport.default.use(new _passportGoogleOauth.Strategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'https://ecommerce-tech-titans.herokuapp.com/api/v1/auth/google/callback',
  scope: ['email', 'profile'],
  passReqToCallback: true
},
// eslint-disable-next-line func-names
async function (request, accessToken, refreshToken, profile, done) {
  try {
    const user = await User.findOne({
      where: {
        email: profile.email
      }
    });
    if (user) {
      const usertoken = _jwt.default.generateToken({
        id: user.id,
        email: user.email,
        roleId: user.roleId
      }, '1d');
      token = usertoken;
    }
    if (!user) {
      const password = generatePassword();
      const hashedPassword = await _bcrypt.default.hashPassword(password);
      const newUser = {
        fullname: `${profile.given_name} ${profile.family_name}`,
        email: profile.email,
        password: profile.password || hashedPassword
      };
      const theGoogleUser = await User.create(newUser);
      // eslint-disable-next-line no-shadow
      done(null, theGoogleUser);
      const UserNEW = await User.findOne({
        where: {
          email: profile.email
        }
      });
      // Assign the token to the user made signup by google account saved in the database

      const Googletoken = _jwt.default.generateToken({
        id: UserNEW.id,
        email: UserNEW.email,
        roleId: UserNEW.roleId
      }, '1d');
      token = Googletoken;
    } else {
      const cookieOptions = {
        httpOnly: true,
        // set cookie maxAge to 24 hours:
        maxAge: 86400,
        secure: true,
        sameSite: 'Strict'
      };
      const cookieString = _cookie.default.serialize('token', token, cookieOptions);
      // Set the cookie in the response headers
      request.res.setHeader('Set-Cookie', cookieString);
      done(null, {
        user,
        token,
        secret
      });
      // done(null, user);
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