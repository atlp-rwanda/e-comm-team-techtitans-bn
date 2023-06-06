"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GroupChatSend = exports.GroupChatReceive = void 0;
var _models = _interopRequireDefault(require("../../database/models"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const Message = _models.default.allmessages;
const GroupChatReceive = (req, res) => {
  Message.findAll().then(message => {
    res.status(200).json({
      message: 'receiveing message.........',
      data: message
    });
  }).then(error => {
    console.log(error);
  });
};
exports.GroupChatReceive = GroupChatReceive;
const GroupChatSend = (req, res) => {
  const {
    text,
    name,
    time
  } = req.body;
  Message.create({
    text,
    name,
    time
  }).then(message => {
    console.log('Group message created:', message.toJSON());
  }).catch(error => {
    console.error('Error creating group message:', error);
  });
  res.status(200).json({
    message: 'sending message.........',
    data: {
      text,
      name,
      time
    }
  });
};
exports.GroupChatSend = GroupChatSend;