import request from 'supertest';
import app from '../../src/app';

import PasswordReminder from '../../src/controllers/user/password.reminder';
import { expect, describe, test } from '@jest/globals';
import passwordReminder from "../../src/controllers/user/password.reminder";
import {
  ExpiringProducts,
  notifyVendorProductOutOfStock
} from "../../src/controllers/notification/notifications.controller";
import job from "../../index.backup";
import {wishlist} from "../../lib/controllers/product/wishlist.controller";
import {Wishlists} from "../mocks/wishlist.mock";
import {enableDisableUser} from "../mocks/disableenable.";

beforeAll(() => {
  PasswordReminder.start();

  passwordReminder.start();
  ExpiringProducts.start();
  notifyVendorProductOutOfStock.start();
  job.start();
});

afterAll(() => {
  PasswordReminder.stop();

  passwordReminder.stop();
  ExpiringProducts.stop();
  notifyVendorProductOutOfStock.stop();
  job.stop();
});
describe('Disable enable account', () => {

  test('Buyer Add to wishlist', async () => {

    const userToken= 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImY2MjA4YzFiLWZiMDMtNGViZi05M2UyLTg3OWFiNTZjZjNjZiIsImVtYWlsIjoiYWRtaW5kaXNhYmxlQGdtYWlsLmNvbSIsInJvbGVJZCI6MSwiaWF0IjoxNjgzMjg1NjAyLCJleHAiOjE3MTQ4NDMyMDJ9.m46dOkTQ7w2eDiO_atnPJIDeism6fOibHdDGnrZjd4M';
    const response = await request(app)
        .put('/api/v1/user/updateAccountStatus/32cc953f-38f9-4979-b620-cded5304a0a9')
        .set('Authorization', `bearer ${userToken}`)
        .send(enableDisableUser);
    expect(response.statusCode).toBe(200);
  });
  test('Buyer Add to wishlist', async () => {

    const userToken= 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImY2MjA4YzFiLWZiMDMtNGViZi05M2UyLTg3OWFiNTZjZjNjZiIsImVtYWlsIjoiYWRtaW5kaXNhYmxlQGdtYWlsLmNvbSIsInJvbGVJZCI6MSwiaWF0IjoxNjgzMjg1NjAyLCJleHAiOjE3MTQ4NDMyMDJ9.m46dOkTQ7w2eDiO_atnPJIDeism6fOibHdDGnrZjd4M';
    const response = await request(app)
        .put('/api/v1/user/updateAccountStatus/32cc')
        .set('Authorization', `bearer ${userToken}`)
        .send(enableDisableUser);
    expect(response.statusCode).toBe(500);
  });
  test('Buyer Add to wishlist', async () => {

    const userToken= 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImY2MjA4YzFiLWZiMDMtNGViZi05M2UyLTg3OWFiNTZjZjNjZiIsImVtYWlsIjoiYWRtaW5kaXNhYmxlQGdtYWlsLmNvbSIsInJvbGVJZCI6MSwiaWF0IjoxNjgzMjg1NjAyLCJleHAiOjE3MTQ4NDMyMDJ9.m46dOkTQ7w2eDiO_atnPJIDeism6fOibHdDGnrZjd4M';
    const response = await request(app)
        .put('/api/v1/user/updateAccountStatus/32cc953f-38f9-4979-b620-cded5304a0a0')
        .set('Authorization', `bearer ${userToken}`)
        .send(enableDisableUser);
    expect(response.statusCode).toBe(404);
  });


  test('Buyer Add to wishlist', async () => {

    const userToken= 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMyY2M5NTNmLTM4ZjktNDk3OS1iNjIwLWNkZWQ1MzA0YTBhNiIsImZ1bGxuYW1lIjoiYnV5ZXIzIiwiZW1haWwiOiJidXllcjNAZ21haWwuY29tIiwicm9sZUlkIjozLCJpYXQiOjE2ODMyOTM0NDYsImV4cCI6MTcxNDg1MTA0Nn0.H85Mgz-GWLeuxKs9zXNiy9eCraKEKkAI048KO3w7pHA';
    const response = await request(app)
        .put('/api/v1/user/updateAccountStatus/32cc953f-38f9-4979-b620-cded5304a0a9')
        .set('Authorization', `bearer ${userToken}`)
        .send(enableDisableUser);
    expect(response.statusCode).toBe(403);
  });


});