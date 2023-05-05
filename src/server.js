import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import app, { connectDB } from './app';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';

dotenv.config();
app.use(cors());

// const server = http.createServer(app);
const httpServer = createServer(app);
const wsServer = new WebSocketServer({ server: httpServer });
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000', // frontend URL
    methods: ['GET', 'POST'],
  },
});
(async () => {
  await connectDB();

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('send_message', (data) => {
      socket.broadcast.emit('receive_message', data);
    });

    socket.on('setup', (userData) => {
      socket.join(userData.id);
      socket.emit('connected');
    });

    socket.on('typing', (room) => socket.in(room).emit('typing'));
    socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));
  });

  const { PORT } = process.env;


  wsServer.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('message', (data) => {
      console.log(`Received message from client: ${data}`);
    });

    socket.on('close', () => {
      console.log('Client disconnected');
    });
  });

  httpServer.listen(PORT, () => {
    console.log(`🍏 Server is running on: http://localhost:${PORT} ... 🌊`);
  });
})();

dotenv.config();
 