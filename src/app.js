import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { sequelize } from './database/models/index';
import combinedDocs from '../docs/index';

dotenv.config();

// const { PORT } = process.env;
const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res
    .status(200)
    .send(
      `<h1 style='text-align: center; color: #CCD6F6; margin-top: 20vh; background: #0A192F; padding: 150px;'>Welcome to team Tech-Titans's E-commerce API!</h1>`,
    );
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully');
  } catch (err) {
    console.log(`Database connection failed: ${err}`);
    // process.exit(1);
  }
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(combinedDocs));

export default app;
