import express from 'express';
import {
  createChat,
  getAllChats,
  getChatById,
} from '../controllers/chat/chat.controller';

const chatRouter = express.Router();

chatRouter.get('/create/:userId', createChat);
chatRouter.get('/one/:chatId', getChatById);
chatRouter.get('/all', getAllChats);

export default chatRouter;
