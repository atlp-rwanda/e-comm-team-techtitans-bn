"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getChatById = exports.getAllChats = exports.createChat = void 0;
var _expressAsyncHandler = _interopRequireDefault(require("express-async-handler"));
var _sequelize = require("sequelize");
var _models = _interopRequireWildcard(require("../../database/models"));
var _jwt = _interopRequireDefault(require("../../utils/jwt.util"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// eslint-disable-next-line import/no-extraneous-dependencies

const Chat = _models.default.chats;
const User = _models.default.users;
// const Message = db.messages;

const createChat = async (req, res) => {
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
    const {
      userId
    } = req.params;
    const existingUser = await User.findOne({
      where: {
        id: userId
      }
    });
    const myProfile = await User.findOne({
      where: {
        id
      }
    });
    if (!existingUser) {
      return res.status(404).json({
        message: '❌ User not found'
      });
    }
    const existingChat = await Chat.findOne({
      where: {
        users: {
          [_sequelize.Op.contains]: [userId]
        }
      }
    });
    if (existingChat) {
      return res.status(409).json({
        message: '😬 Chat already exists'
      });
    }
    const newChat = await Chat.create({
      chatName: `${myProfile.dataValues.fullname}` + ' &' + ` ${existingUser.dataValues.fullname}`,
      users: [id, userId]
    }).then(createdChat => {
      res.status(200).json({
        message: '🍀 Chat created successfully',
        data: createdChat.dataValues
      });
    }).catch(err => {
      res.status(500).json({
        message: err.message
      });
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};
exports.createChat = createChat;
const getChatById = async (req, res) => {
  const {
    chatId
  } = req.params;
  try {
    const chat = await Chat.findOne({
      where: {
        id: chatId
      }
    });
    if (!chat) {
      return res.status(404).json({
        message: '😬 Chat not found'
      });
    }
    const theChatMessages = await _models.messages.findAll({
      where: {
        chatId
      },
      // 👇🏽 might be Removed or Edited later
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
      // 👆🏽 might be Removed or Edited later
    });

    const chatToFetch = {
      chatName: chat.dataValues.chatName,
      users: chat.dataValues.users,
      messages: theChatMessages
    };
    res.status(200).json({
      message: '🍀 Chat was successfully fetched',
      data: chatToFetch
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
exports.getChatById = getChatById;
const getAllChats = (0, _expressAsyncHandler.default)(async (req, res) => {
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
    const chats = await Chat.findAll({
      where: {
        users: {
          [_sequelize.Op.contains]: [id]
        }
      }
    });
    if (!chats) {
      return res.status(404).json({
        message: '🚫 You have no chats yet'
      });
    }
    res.status(200).json({
      message: `🍀 Here are all your ${chats.length} chats`,
      data: chats
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});
exports.getAllChats = getAllChats;