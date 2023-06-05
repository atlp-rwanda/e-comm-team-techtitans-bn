"use strict";

var _dotenv = _interopRequireDefault(require("dotenv"));
var _http = _interopRequireDefault(require("http"));
var _socket = require("socket.io");
var _cors = _interopRequireDefault(require("cors"));
var _app = _interopRequireWildcard(require("./app"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// import dotenv from 'dotenv';
// import http from 'http';
// import { Server } from 'socket.io';
// import cors from 'cors';
// import app, { connectDB } from './app';
// import { createServer } from 'http';
// import { WebSocketServer } from 'ws';

// dotenv.config();
// app.use(cors());

// // const server = http.createServer(app);
// const httpServer = createServer(app);
// const wsServer = new WebSocketServer({ server: httpServer });
// const io = new Server(httpServer, {
//   cors: {
//     origin: 'http://localhost:5173', // frontend URL
//     methods: ['GET', 'POST'],
//   },
// });
// (async () => {
//   await connectDB();

//   io.on('connection', (socket) => {
//     console.log(`User connected: ${socket.id}`);

//     socket.on('send_message', (data) => {
//       socket.broadcast.emit('receive_message', data);
//     });

//     socket.on('setup', (userData) => {
//       socket.join(userData.id);
//       socket.emit('connected');
//     });

//     socket.on('typing', (room) => socket.in(room).emit('typing'));
//     socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));
//   });

//   const { PORT } = process.env;

//   wsServer.on('connection', (socket) => {
//     console.log('New client connected');

//     socket.on('message', (data) => {
//       console.log(`Received message from client: ${data}`);
//     });

//     socket.on('close', () => {
//       console.log('Client disconnected');
//     });
//   });

//   httpServer.listen(PORT, () => {
//     console.log(`🍏 Server is running on: http://localhost:${PORT} ... 🌊`);
//   });
// })();

_dotenv.default.config();
_app.default.use((0, _cors.default)());
const httpServer = _http.default.createServer(_app.default);
const io = new _socket.Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    // frontend URL
    methods: ['GET', 'POST']
  }
});
(async () => {
  await (0, _app.connectDB)();
  io.on('connection', socket => {
    console.log(`User connected: ${socket.id}`);
    socket.on('send_message', data => {
      socket.broadcast.emit('receive_message', data);
    });
    socket.on('setup', userData => {
      socket.join(userData.id);
      socket.emit('connected');
    });
    socket.on('typing', room => socket.in(room).emit('typing'));
    socket.on('stop typing', room => socket.in(room).emit('stop typing'));
  });
  const {
    PORT
  } = process.env;
  httpServer.listen(PORT, () => {
    console.log(`🍏 Server is running on: http://localhost:${PORT} ... 🌊`);
  });
})();