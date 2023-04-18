import request from 'supertest';
import app from '../../src/app';
import PasswordReminder from '../../src/controllers/user/password.reminder';
import { expect, describe, test } from '@jest/globals';

describe('Test logout route', () => {
  test('test logout Route', async () => {
    const response = await request(app).post('/api/v1/user/logout');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Logged out successfully' });
    expect(response.header['set-cookie']).toContain(
      'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
    );
  });

  afterAll(() => {
    PasswordReminder.stop(); // Stop the passwordReminder service
    // Stop any other asynchronous tasks that are still running
    // ...
  });
});