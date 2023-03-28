import dotenv from 'dotenv';
import app, { connectDB } from './app';

dotenv.config();

const { PORT } = process.env;

(async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🍏 Server is running on: http://localhost:${PORT} ... 🌊`);
  });
})();
