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
import {profile} from "../mocks/user.mock";

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
describe('Updating Profile for users', () => {

    test('Updating profile', async () => {

        const userToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMyY2M5NTNmLTM4ZjktNDk3OS1iNjIwLWNkZWQ1MzA0YTBhNiIsImZ1bGxuYW1lIjoiYnV5ZXIzIiwiZW1haWwiOiJidXllcjNAZ21haWwuY29tIiwicm9sZUlkIjozLCJpYXQiOjE2ODMyMDU5NzIsImV4cCI6MTY4MzI5MjM3Mn0.y5gOtgrm0ondJLJ8Roo6o6Zq8dcPyHjlX3nsciAXxiE';
        const response = await request(app)
            .put('/api/v1/user/profile')
            .set('Authorization', `bearer ${userToken}`)
            .send(profile);

        expect(response.statusCode).toBe(201);
    });
});