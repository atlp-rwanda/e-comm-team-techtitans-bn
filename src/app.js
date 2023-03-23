import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from "swagger-ui-express";
import combinedDocs from "../docs/index.js"


dotenv.config();

const { PORT } = process.env;
const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.status(200).send({
    status: 200,
    success: true,
    message: `Welcome to team Tech-Titans's API! Endpoints available at http://localhost:${PORT}/api/v1 + the endpoint you want to hit`,
  });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(combinedDocs));

export default app;
