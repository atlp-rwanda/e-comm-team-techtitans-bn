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
let token='';
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
                if (user){
                    const usertoken = JwtUtility.generateToken({
                            id: user.id,
                            email: user.email,
                            roleId: user.roleId,
                        }, "1d"

                    );
                    token = usertoken;
                    console.log('***USER_TOKEN***', token);
                }

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
                    const UserNEW = await User.findOne({ where: { email: profile.email } });
                    // Assign the token to the user made signup by google account saved in the database

                    const Googletoken = JwtUtility.generateToken({
                         id: UserNEW.id,
                         email: UserNEW.email,
                         roleId: UserNEW.roleId,
                     }, "1d"

                 );
                 token = Googletoken;
                 console.log('***USER_TOKEN for google***', token);
                }
             else {
                    const cookieOptions = {
                        httpOnly: true,
                        // set cookie maxAge to 24 hours:
                        maxAge: 86400,
                        secure: false,
                        sameSite: 'Strict',
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





