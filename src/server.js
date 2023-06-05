import dotenv from 'dotenv';
import httpSerever from 'http';
import sockets from 'socket.io';
import cors from 'cors';
import app, { connectDB } from './app';

const http = httpSerever.Server(app);
const { PORT } = process.env;

dotenv.config();
app.use(cors());

http.listen(PORT, () => {
  console.log(`Server listening to http://localhost:${PORT} ... 🌊`);
});

const socketIO = sockets(http, {
  cors: {
    origin: 'https://tech-titans.techsroutine.com/',
  },
});

let users = [];

socketIO.on('connection', (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);
  socket.on('message', (data) => {
    socketIO.emit('messageResponse', data);
    console.log("received", data);
  });

  socket.on('newUser', (data) =>{
    users.push(data);
    socketIO.emit('newUserResponse', users);
    console.log("new user joined a chat", users);
  })

  socket.on('disconnect', () => {
    users = users.filter((user) => user.socketID !== socket.id);
    socketIO.emit('newUserResponse', users);
    socket.disconnect();
    console.log('🔥: A user disconnected');
  });

  socket.on('typing', (data) => socket.broadcast.emit('typingResponse', data));
});
