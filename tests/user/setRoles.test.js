import request from 'supertest';
import app from '../../src/app';
const { describe, expect, afterAll } = require('@jest/globals');
import { exec } from 'child_process';

beforeAll(async () => {
  await new Promise((resolve, reject) => {
    exec('npx sequelize db:seed --seed 20230505140240-roles', (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }

      console.log(stdout);
      resolve();
    });
  });
});

describe('only admins can set roles and permission', () => {
  test('role and permission', async () => {
    const payload = {
      email: 'great@gmail.com',
      role: '2',
    };
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImRjMDNkZDVhLWU3YzctNGFhZS04YWZjLWQyZTFjNjVlNGY4ZCIsImVtYWlsIjoiZ3JlYXRAZ21haWwuY29tIiwicm9sZUlkIjoyLCJpYXQiOjE2ODMyNzczOTYsImV4cCI6MTY4MzM2Mzc5Nn0.j1e6ED12TdFPeVAZWoAdB_pnYIKXHBViSi5wt-aRVQY';
    const role = await request(app)
      .post('/api/v1/user/role')
      .set('Authorization', `bearer ${token}`)
      .send(payload);
    console.log(role.body);
    expect(role.statusCode).toBe(200);
  });
});

// afterAll(async () => {
//   await new Promise((resolve, reject) => {
//     exec('npx sequelixe db:seed:undo 20230505140240-roles', (error, stdout, stderr) => {
//       if (error) {
//         reject(error);
//         return;
//       }
//       console.log(stdout);
//       resolve();
//     });
//   });
// });
