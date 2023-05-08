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
import {rateRiview} from "../mocks/review.mock";

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
describe('display  all Reviews To a product', () => {

    test('display Reviews', async () => {
        const response = await request(app)
            .get('/api/v1/review/getReview/daa7ea52-71e7-412d-b250-8a0cf3dd8267')

        expect(response.statusCode).toBe(200);
    });

    test('Unavalable Review to a product', async () => {

        const response = await request(app)
        .get('/api/v1/review/getReview/daa7ea52-71e7-412d-b250-8a0cf3dd8200')

        expect(response.statusCode).toBe(404);
    });

  test('found no average of rating to a product', async () => {

    const response = await request(app)
    .get('/api/v1/review/rating/daa7ea52-71e7-412d-b250-8a0cf3dd8260')

    expect(response.statusCode).toBe(404);
});

test('average of rating to a product', async () => {

  const response = await request(app)
  .get('/api/v1/review/rating/daa7ea52-71e7-412d-b250-8a0cf3dd8267')

  expect(response.statusCode).toBe(200);
});

});