"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendMessage = exports.getMessages = void 0;
var _expressAsyncHandler = _interopRequireDefault(require("express-async-handler"));
var _models = _interopRequireDefault(require("../../database/models"));
var _jwt = _interopRequireDefault(require("../../utils/jwt.util"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const Chat = _models.default.chats;
const User = _models.default.users;
const Message = _models.default.messages;
const sendMessage = async (req, res) => {
  const {
    chatId
  } = req.params;
  const {
    content
  } = req.body;
  try {
    const tokenHeader = req.headers.authorization;
    if (!tokenHeader) {
      return res.status(401).json({
        message: 'Token not provided'
      });
    }
    const token = tokenHeader.split(' ')[1];
    const decodedToken = _jwt.default.verifyToken(token);
    const {
      id
    } = decodedToken;
    const chat = await Chat.findByPk(chatId);
    if (!chat) {
      return res.status(404).json({
        message: '😬 Chat not found...'
      });
    }
    const message = await Message.create({
      content,
      senderId: id,
      chatId
    });
    // add the message to the chat's list of messages

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
exports.sendMessage = sendMessage;
const getMessages = (0, _expressAsyncHandler.default)(async (req, res) => {
  const {
    chatId
  } = req.params;
  try {
    const chat = await Chat.findByPk(chatId);
    if (!chat) {
      return res.status(404).json({
        message: 'Chat not found'
      });
    }
    const messages = await Message.findAll({
      where: {
        chatId
      }
    });
    res.status(200).json({
      message: `❇️ Here are all ${messages.length} messages in the (${chat.chatName}) chat`,
      data: messages
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error'
    });
  }
});
exports.getMessages = getMessages;