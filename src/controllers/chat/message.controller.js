import asyncHandler from 'express-async-handler';
import db from '../../database/models';
import JwtUtility from '../../utils/jwt.util';

const Chat = db.chats;
const User = db.users;
const Message = db.messages;

const sendMessage = async (req, res) => {
  const { chatId } = req.params;
  const { content } = req.body;

  try {
    const tokenHeader = req.headers.authorization;
    if (!tokenHeader) {
      return res.status(401).json({ message: 'Token not provided' });
    }
    const token = tokenHeader.split(' ')[1];
    const decodedToken = JwtUtility.verifyToken(token);
    const { id } = decodedToken;
    const chat = await Chat.findByPk(chatId);

    if (!chat) {
      return res.status(404).json({ message: '😬 Chat not found...' });
    }

    const message = await Message.create({
      content,
      senderId: id,
      chatId,
    });
    // add the message to the chat's list of messages

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMessages = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  try {
    const chat = await Chat.findByPk(chatId);

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    const messages = await Message.findAll({
      where: {
        chatId,
      },
    });

    res.status(200).json({
      message: `❇️ Here are all ${messages.length} messages in the (${chat.chatName}) chat`,
      data: messages,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export { sendMessage, getMessages };
