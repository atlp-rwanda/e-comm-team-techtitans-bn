// import passport from 'passport';
// require('express-session');
// const GoogleStrategy = require('passport-google-oauth2').Strategy;

// const GOOGLE_CLIENT_ID =
//   '876690165237-pl648ikfkf7e4d2qi8hfagchafeb5kga.apps.googleusercontent.com';

// const GOOGLE_CLIENT_SECRET = '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';

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: GOOGLE_CLIENT_ID,
//       clientSecret: GOOGLE_CLIENT_SECRET,
//       callbackURL: 'http://localhost:3000/google/callback',
//       passReqToCallback: true,
//     },
//     function (request, accessToken, refreshToken, profile, done) {
//       return done(err, profile);
//     },
//     // function (request, accessToken, refreshToken, profile, done) {
//     //   User.findOrCreate({ googleId: profile.id }, function (err, user) {
//     //     return done(err, user);
//     //   });
//     // },
//   ),
// );

// passport.serializeUser((user, done) => {
//   done(null, user);
// });
// passport.deserializeUser((user, done) => {
//   done(null, user);
// });
"use strict";