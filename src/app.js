import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import passport from 'passport';
import session from 'express-session';
import { sequelize } from './database/models/index';
// import db from './database/models/index';
import router from './routes';
import combinedDocs from '../docs/index';
require('./middleware/auth/passport-setup');

dotenv.config();

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.use(session({ secret: 'melody hensley is my spirit animal' }));

require('./middleware/auth/passport-setup');

app.set('view engine', 'ejs');

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.render('pages/index');
});

app.get('/success', (req, res) => {
  res.render('pages/profile.ejs', {
    name: req.user.displayName,
    email: req.user.emails[0].value,
    pic: req.user.photos[0].value,
  });
});

app.get(
  '/google',
  passport.authenticate('google', {
    scope: ['email', 'profile'],
  }),
);

app.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/failed' }),
  function (req, res) {
    res.redirect('/success');
  },
);

//! ************CHANGES ABOVE************

export const connectDB = async () => {
  try {
    // await sequelize.sync({ force: true });
    await sequelize.sync();
    console.log('🟢 Database connection established successfully');
  } catch (err) {
    console.log(`Database connection failed: ${err}`);
    process.exit(1);
  }
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(combinedDocs));

app.use('/api/v1', router);

export default app;
