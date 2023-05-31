import express from 'express';
import passport from 'passport';
import session from 'express-session';
import cors from 'cors';

require('../middleware/auth/passport.auth');

const authRouter = express();

authRouter.use(cors());

authRouter.use(express.json());
authRouter.use(express.urlencoded({ extended: true }));

authRouter.use(
  session({
    secret: 'melody hensley is my spirit animal',
    resave: false,
    saveUninitialized: true,
  }),
);

authRouter.set('view engine', 'ejs');

authRouter.use(passport.initialize());
authRouter.use(passport.session());

authRouter.get('/success', (req, res) => {
  res.status(200).json({
    message: 'You have successfully logged in',
  });
});

authRouter.get('/', (req, res) => {
  res.render('pages/index');
});

authRouter.get(
  '/google',
  passport.authenticate('google', {
    scope: ['email', 'profile'],
  }),
);

authRouter.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/api/v1/auth/failed' }),
  function (req, res) {
    // res.redirect('/api/v1/auth/success');
    res.redirect('https://tech-titans.techsroutine.com');
  },
);

export default authRouter;
