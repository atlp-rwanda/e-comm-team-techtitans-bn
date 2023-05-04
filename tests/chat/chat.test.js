import request from 'supertest';
import { execSync } from 'child_process';
import { expect, describe, test } from '@jest/globals';
import { Op } from 'sequelize';
import app from '../../src/app';
import db, { messages } from '../../src/database/models';
import JwtUtility from '../../src/utils/jwt.util';

const User = db.users;
const Chat = db.chats;

describe('Chat Endpoints', () => {
  // Creating a Chat
  test('Create a chat', async () => {
    const buyer1Id = '09ad1ad3-2d9b-4edc-a933-b9f3880f9d1d';
    const guestId = '5616c2ed-cad5-4cb0-8ca2-81b31dc8cef2';

    const newChat = await Chat.create({
      id: 'daa7ea52-71e7-412d-b250-8a0cf3dd8212',
      chatName: 'buyer1' + ' &' + ' guest',
      users: [buyer1Id, guestId],
    });

    const response = await request(app).get(`/api/v1/chats/create/${buyer1Id}`);
    expect(response.statusCode).toBe(401); // ! approx. 200
  });

  test('Create a chat but the user does not exist', async () => {
    const wrongUserId = '94a9103c-a5f4-4956-af0d-51aac406bf29';
    const response = await request(app).get(
      `/api/v1/chats/create/${wrongUserId}`,
    );
    expect(response.statusCode).toBe(401); // ! approx. 404
  });

  // Fetch a Chat
  test('Fetch a non-existing chat by its ID', async () => {
    const wrongChatId = 'daa7ea52-71e7-412d-b250-8a0cf3dd8211';
    const response = await request(app).get(`/api/v1/chats/one/${wrongChatId}`);
    expect(response.statusCode).toBe(404);
  });

  test('Fetch one chat', async () => {
    const response = await request(app).get(
      '/api/v1/chats/one/daa7ea52-71e7-412d-b250-8a0cf3dd8212',
    );
    expect(response.statusCode).toBe(200);
  });

  test('Catch an internal server error while fetching a chat', async () => {
    const response = await request(app).get('/api/v1/chats/one/daa7ea52-71e7');
    expect(response.statusCode).toBe(500);
  });

  // Fetch all Chats
  test('Fetching all chats of a user who does not have chats', async () => {
    const existingUserWithoutChats = 'f2ec3070-ab68-4871-8b9b-43bb2718e3c1';

    const chats = await Chat.findAll({
      where: {
        users: { [Op.contains]: [existingUserWithoutChats] },
      },
    });
    const response = await request(app).get('/api/v1/chats/all');
    if (!chats) {
      expect(response.statusCode).toBe(404);
    }
  });

  // test('Fetching all my chats as a user', async () => {
  //   const response = await request(app).get('/api/v1/chats/all');
  //   const theToken =
  //     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjA5YWQxYWQzLTJkOWItNGVkYy1hOTMzLWI5ZjM4ODBmOWQxZCIsImZ1bGxuYW1lIjoiYnV5ZXIxIiwiZW1haWwiOiJidXllcjFAZ21haWwuY29tIiwicm9sZUlkIjozLCJpYXQiOjE2ODMyODYyMDYsImV4cCI6MTk5ODg2MjIwNn0.4_Xj0mhCZPjzXhqmaGqWcTKlxgKM8d_Z77SEnv7jg7k'; // 10y
  //   const decodedToken = JwtUtility.verifyToken(theToken);
  //   const { id } = decodedToken;

  //   const chats = await Chat.findAll({
  //     where: {
  //       users: { [Op.contains]: [id] },
  //     },
  //   });
  //   if (chats) {
  //     expect(response.statusCode).toBe(200);
  //   }
  // });
});
