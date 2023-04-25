"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _chat = require("../controllers/chat/chat.controller");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const chatRouter = _express.default.Router();
chatRouter.get('/create/:userId', _chat.createChat);
chatRouter.get('/one/:chatId', _chat.getChatById);
chatRouter.get('/all', _chat.getAllChats);
var _default = chatRouter;
exports.default = _default;