"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _message = require("../controllers/chat/message.controller");
var _groupChat = require("../controllers/chat/groupChat.controller");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const messageRouter = _express.default.Router();
messageRouter.post('/send/:chatId', _message.sendMessage);
messageRouter.get('/:chatId', _message.getMessages);
messageRouter.post('/group/send', _groupChat.GroupChatSend);
messageRouter.get('/group/receive', _groupChat.GroupChatReceive);
var _default = messageRouter;
exports.default = _default;