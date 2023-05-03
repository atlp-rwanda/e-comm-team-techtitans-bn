import { describe, expect, jest, test } from '@jest/globals';
import request from 'supertest';
import app from '../../src/app';
import PasswordReminder from '../../src/controllers/user/password.reminder';
// import token from '../mocks/payToken.mock';
import { payData } from '../mocks/payToken.mock';
// import buyerToken from '../mocks/payToken.mock';

describe('return a receipt after a successful payment', () => {
  const { STRIPE_SECRET_KEY } = process.env;
  test('Return a receipt', async () => {
    const buyerToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImUxZWVmZjE1LWM2YzgtNDRiNi1hNWNiLTU2YjVkMTI3OWNhYyIsImVtYWlsIjoiaXNoaW13ZXJpY2hhcmQyNkBnbWFpbC5jb20iLCJyb2xlSWQiOjMsImlhdCI6MTY4MjE1MTI4NCwiZXhwIjoxNjgyMjM3Njg0fQ.ivilAgFydcbGSvnfZhX2Uc-5SmdAjTBjB-SgKkmRrJE';
    const payToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZWNlaXZlck5hbWUiOiJJc2ltd2UgUmljaGFyZCIsImFkZHJlc3MiOiJrYWN5aXJ1IiwicGhvbmVOdW1iZXIiOiIwNzgwNDE3Mjg3Iiwic2hpcHBpbmdNZXRob2QiOiJJbi1zdG9jayBQaWNrdXAiLCJhbW91bnQiOjUwMCwiaWF0IjoxNjgzMTI0OTY5LCJleHAiOjE3MTQ2ODI1Njl9.R_Md1uH9hOYUaq6vKgkFCv8lKiDipNm3qkjp9RIeJ3M';
    const pay = await request(app).post(`/api/v1/payment/${payToken}`).set('Authorization', `bearer ${buyerToken}`).send(payData);
    expect(pay.statusCode).toBe(200);
    jest.setTimeout(9000);
  });
  test('When no token is provided', async () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZWNlaXZlck5hbWUiOiJJc2ltd2UgUmljaGFyZCIsImFkZHJlc3MiOiJOeWFydXRhcmFtYSIsInBob25lTnVtYmVyIjoiMDc4MDQxNzI4NyIsInNoaXBwaW5nTWV0aG9kIjoiSW4tc3RvY2sgUGlja3VwIiwiYW1vdW50Ijo1MDAwLCJpYXQiOjE2ODI4Nzc3OTcsImV4cCI6MTY4Mjk2NDE5N30.6_yj-YR_52S76YB0ObkNhIIDewSub4pjrLxmiRdXmqc';
    const pay = await request(app).post(`/api/v1/payment/${token}`).send(payData);
    expect(pay.statusCode).toBe(401);
  });
  test('wrong card number', async () => {
    const buyerToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImUxZWVmZjE1LWM2YzgtNDRiNi1hNWNiLTU2YjVkMTI3OWNhYyIsImVtYWlsIjoiaXNoaW13ZXJpY2hhcmQyNkBnbWFpbC5jb20iLCJyb2xlSWQiOjMsImlhdCI6MTY4MjE1MTI4NCwiZXhwIjoxNjgyMjM3Njg0fQ.ivilAgFydcbGSvnfZhX2Uc-5SmdAjTBjB-SgKkmRrJE';
    const token = 'jnknlnjnnkn';
    const payData = {
      cvc: '123',
      cardNumber: '42424242424',
    };
    const pay = await request(app).post(`/api/v1/payment/${token}`).set('Authorization', `bearer ${buyerToken}`).send(payData);
    expect(pay.statusCode).toBe(500); 
  });

  afterAll(() => {
    PasswordReminder.stop(); // Stop the passwordReminder service
    // Stop any other asynchronous tasks that are still running
    // ...
  });
});
