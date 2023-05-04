import request from 'supertest';
import { execSync } from 'child_process';
import { expect, describe, test } from '@jest/globals';
import { Op } from 'sequelize';
import app from '../../src/app';
import db, { messages } from '../../src/database/models';
import JwtUtility from '../../src/utils/jwt.util';

// const User = db.users;
const Chat = db.chats;
const Message = db.messages;

describe('Chat-Message Endpoints', () => {
  // Sending a message
  test('Send a message to but the chat does not exist', async () => {
    const chatId = 'daa7ea52-71e7-412d-b250-8a0cf3dd8211'; // does not exist

    // const theToken =
    //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjA5YWQxYWQzLTJkOWItNGVkYy1hOTMzLWI5ZjM4ODBmOWQxZCIsImZ1bGxuYW1lIjoiYnV5ZXIxIiwiZW1haWwiOiJidXllcjFAZ21haWwuY29tIiwicm9sZUlkIjozLCJpYXQiOjE2ODMyODYyMDYsImV4cCI6MTk5ODg2MjIwNn0.4_Xj0mhCZPjzXhqmaGqWcTKlxgKM8d_Z77SEnv7jg7k'; // 10y
    // const decodedToken = JwtUtility.verifyToken(theToken);
    // const { id } = decodedToken;
    // console.log('***THE IIIID***', id);

    const response = await request(app).post(`/api/v1/message/send/${chatId}`);
    const chat = await Chat.findByPk(chatId);
    if (!chat) {
      expect(response.statusCode).toBe(404);
    }
  });
});
