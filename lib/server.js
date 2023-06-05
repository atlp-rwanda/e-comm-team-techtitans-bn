"use strict";

var _dotenv = _interopRequireDefault(require("dotenv"));
var _http = _interopRequireDefault(require("http"));
var _socket = _interopRequireDefault(require("socket.io"));
var _cors = _interopRequireDefault(require("cors"));
var _app = _interopRequireWildcard(require("./app"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const http = _http.default.Server(_app.default);
const {
  PORT
} = process.env;
_dotenv.default.config();
_app.default.use((0, _cors.default)());
http.listen(PORT, () => {
  console.log(`Server listening to http://localhost:${PORT} ... 🌊`);
});
const socketIO = (0, _socket.default)(http, {
  cors: {
    origin: 'https://tech-titans.techsroutine.com/'
  }
});
let users = [];
socketIO.on('connection', socket => {
  console.log(`⚡: ${socket.id} user just connected!`);
  socket.on('message', data => {
    socketIO.emit('messageResponse', data);
    console.log("received", data);
  });
  socket.on('newUser', data => {
    users.push(data);
    socketIO.emit('newUserResponse', users);
    console.log("new user joined a chat", users);
  });
  socket.on('disconnect', () => {
    users = users.filter(user => user.socketID !== socket.id);
    socketIO.emit('newUserResponse', users);
    socket.disconnect();
    console.log('🔥: A user disconnected');
  });
  socket.on('typing', data => socket.broadcast.emit('typingResponse', data));
});