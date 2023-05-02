import { describe, expect, test } from '@jest/globals';
import request from 'supertest';
import app from '../../src/app';
import checkout from '../mocks/checkout.mock';
import PasswordReminder from '../../src/controllers/user/password.reminder';

describe('on a successful checkout a buyer should receive a token', () => {
  test('if Token is returned', async () => {
    const data = await request(app).post('/api/v1/checkout').send(checkout);
    expect(data.statusCode).toBe(200);
  });
  afterAll(() => {
    PasswordReminder.stop(); // Stop the passwordReminder service
    // Stop any other asynchronous tasks that are still running
    // ...
  });
});
