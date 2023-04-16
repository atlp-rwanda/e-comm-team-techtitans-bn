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







import passport from 'passport';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import BcryptUtility from '../../utils/bcrypt.util';
import JwtUtility from '../../utils/jwt.util';
import db from '../../database/models';
// import {response} from "express";
import cookie from 'cookie';


// const response = require('express');
const User = db.users;
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

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: 'http://localhost:8000/api/v1/auth/google/callback',
            passReqToCallback: true,
        },

        async function (request, accessToken, refreshToken, profile, done) {
            try {

                const user = await User.findOne({ where: { email: profile.email } });
                console.log(user);
                const token = JwtUtility.generateToken({
                        id: user.id,
                        email: user.email,
                        roleId: user.roleId,
                    }, "1d"
                );
                console.log('***USER_TOKEN***', token);




                // const cookieOptions = {
                //   httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
                //   maxAge: 24 * 60 * 60 * 1000, // Cookie expires in 1 day
                //   secure: false, // Only send cookie over HTTPS in production
                // };
                // response.cookie('token', token, cookieOptions);

                if (!user) {
                    const password = generatePassword();
                    const hashedPassword = await BcryptUtility.hashPassword(password);
                    const newUser = {
                        fullname: `${profile.given_name} ${profile.family_name}`,
                        email: profile.email,
                        password: profile.password || hashedPassword,
                    };
                    const theGoogleUser = await User.create(newUser);
                    // eslint-disable-next-line no-shadow
                    done(null, theGoogleUser);
                } else {
                    const cookieOptions = {
                        httpOnly: false,
                        maxAge: 24 * 60 * 60 * 1000,
                        secure: false,
                    };
                    const cookieString = cookie.serialize('token', token, cookieOptions);
                    // Set the cookie in the response headers
                    request.res.setHeader('Set-Cookie', cookieString);
                    done(null, { user, token, secret });
                    // done(null, user);
                }
            } catch (error) {
                done(error, null);
            }
        },
    ),
);

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
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


