import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { SwaggerTheme } from 'swagger-themes';
import session from 'express-session';
import passport from 'passport';
import path from 'path';
import { sequelize } from './database/models/index';
import {
  ExpiringProducts,
  notifyVendorProductOutOfStock,
} from './controllers/notification/notifications.controller';
// import db from './database/models/index';
import router from './routes';
import combinedDocs from '../docs/index';
import passwordReminder from './controllers/user/password.reminder';
import ExpiredProductRemover from './controllers/product/product.expiration';
import job from '../index.backup';

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: 'melody hensley is my spirit animal',
    resave: false,
    saveUninitialized: true,
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res
    .status(200)
    .send(
      `<h1 style='text-align: center; color: #CCD6F6; margin-top: 20vh; background: #0A192F; padding: 150px;'>Welcome to team Tech-Titans's E-commerce API!</h1>`,
    );
});

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

// Swagger Docs Dark-Mode setup
const theme = new SwaggerTheme('v3');

const options = {
  explorer: true,
  customCss: theme.getBuffer('dark'),
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(combinedDocs, options));

app.use('/api/v1', router);

passwordReminder.start();
ExpiringProducts.start();
notifyVendorProductOutOfStock.start();
job.start();
// 👇🏽 ChatApp frontend Deployment

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname1, '/views/chat/build')));

  app.get('*', (req, res) => {
    res.sendFile(
      path.resolve(__dirname1, 'views', 'chat', 'build', 'index.html'),
    );
  });
} else {
  app.get('/', (req, res) => {
    res.status(200).send('🍀 API is running successfully');
  });
}

// 👆🏽 ChatApp frontend Deployment

export default app;
