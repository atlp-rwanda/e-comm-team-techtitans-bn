import express from 'express';
import {
  // eslint-disable-next-line import/named
  sendMessage,
  getMessages,
} from '../controllers/chat/message.controller';

const messageRouter = express.Router();

messageRouter.post('/send/:chatId', sendMessage);
messageRouter.get('/:chatId', getMessages);

export default messageRouter;
