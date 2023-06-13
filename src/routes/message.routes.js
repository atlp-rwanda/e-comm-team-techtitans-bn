import express from 'express';
import {
  // eslint-disable-next-line import/named
  sendMessage,
  getMessages,
} from '../controllers/chat/message.controller';
import { GroupChatReceive, GroupChatSend } from '../controllers/chat/groupChat.controller';

const messageRouter = express.Router();

messageRouter.post('/send/:chatId', sendMessage);
messageRouter.get('/:chatId', getMessages);
messageRouter.post('/group/send', GroupChatSend);
messageRouter.get('/group/receive', GroupChatReceive);

export default messageRouter;
