"use strict";

var _passport = _interopRequireDefault(require("passport"));
var _passportGoogleOauth = require("passport-google-oauth2");
var _bcrypt = _interopRequireDefault(require("../../utils/bcrypt.util"));
var _jwt = _interopRequireDefault(require("../../utils/jwt.util"));
var _models = _interopRequireDefault(require("../../database/models"));
var _cookie = _interopRequireDefault(require("cookie"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// /* eslint-disable prefer-arrow-callback */
// import passport from 'passport';
// // eslint-disable-next-line import/no-extraneous-dependencies
// import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
// import BcryptUtility from '../../utils/bcrypt.util';
// import db from '../../database/models';
//
// const User = db.users;
// const generatePassword = () => {
//   const length = 8;
//   const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
//   let password = '';
//   // eslint-disable-next-line no-plusplus
//   for (let i = 0; i < length; i++) {
//     password += charset.charAt(Math.floor(Math.random() * charset.length));
//   }
//   return password;
// };
//
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: 'https://ecommerce-tech-titans.herokuapp.com/api/v1/auth/google/callback',
//       passReqToCallback: true,
//     },
//     async function (request, accessToken, refreshToken, profile, done) {
//       try {
//         const user = await User.findOne({ where: { email: profile.email } });
//         if (!user) {
//           const password = generatePassword();
//           const hashedPassword = await BcryptUtility.hashPassword(password);
//           const newUser = {
//             fullname: `${profile.given_name} ${profile.family_name}`,
//             email: profile.email,
//             password: profile.password || hashedPassword,
//           };
//           const theGoogleUser = await User.create(newUser);
//           done(null, theGoogleUser);
//         } else {
//           done(null, user);
//         }
//       } catch (error) {
//         done(error, null);
//       }
//     },
//   ),
// );
//
//
// passport.serializeUser((user, done) => {
//   done(null, user);
// });
// passport.deserializeUser((user, done) => {
//   done(null, user);
// });

/* eslint-disable prefer-arrow-callback */

// eslint-disable-next-line import/no-extraneous-dependencies

// import {response} from "express";

// const response = require('express');
const User = _models.default.users;
const secret = process.env.COOKIE_SECRET;
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
    console.log(user);
    const token = _jwt.default.generateToken({
      id: user.id,
      email: user.email,
      roleId: user.roleId
    }, "1d");
    console.log('***USER_TOKEN***', token);

    // const cookieOptions = {
    //   httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    //   maxAge: 24 * 60 * 60 * 1000, // Cookie expires in 1 day
    //   secure: false, // Only send cookie over HTTPS in production
    // };
    // response.cookie('token', token, cookieOptions);

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
    } else {
      const cookieOptions = {
        httpOnly: false,
        maxAge: 24 * 60 * 60 * 1000,
        secure: false
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

// import passport from 'passport';
// import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
// import BcryptUtility from '../../utils/bcrypt.util';
// import JwtUtility from '../../utils/jwt.util';
// import db from '../../database/models';
// import cookie from 'cookie';
//
// const User = db.users;
// const secret = process.env.COOKIE_SECRET;
// const generatePassword = () => {
//     const length = 8;
//     const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
//     let password = '';
//     for (let i = 0; i < length; i++) {
//         password += charset.charAt(Math.floor(Math.random() * charset.length));
//     }
//     return password;
// };
//
// passport.use(
//     new GoogleStrategy(
//         {
//             clientID: process.env.GOOGLE_CLIENT_ID,
//             clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//             callbackURL: 'http://localhost:8000/api/v1/auth/google/callback',
//             passReqToCallback: true,
//         },
//         async function (request, accessToken, refreshToken, profile, done) {
//             try {
//                 const user = await User.findOne({ where: { email: profile.email } });
//                 const token = JwtUtility.generateToken(
//                     {
//                         id: user.id,
//                         email: user.email,
//                         roleId: user.roleId,
//                     },
//                     '1d'
//                 );
//                 const cookieOptions = {
//                     httpOnly: false,
//                     maxAge: 24 * 60 * 60 * 1000,
//                     secure: false,
//                 };
//                 const cookieString = cookie.serialize('token', token, cookieOptions);
//                 // Set the cookie in the response headers
//                 request.res.setHeader('Set-Cookie', cookieString);
//                 done(null, { user, token, secret });
//             } catch (error) {
//                 done(error, null);
//             }
//         }
//     )
// );
//
// passport.serializeUser((user, done) => {
//     done(null, user);
// });
// passport.deserializeUser((user, done) => {
//     done(null, user);
// });
//