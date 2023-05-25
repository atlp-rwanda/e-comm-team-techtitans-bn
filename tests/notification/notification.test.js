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
describe('notification', () => {


    test('get all notification', async () => {

        const userToken= 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijk5NWJiYzY2LTZhMjgtNDNhMC05NDY3LTMwMDM2NTQyNDIwYyIsImVtYWlsIjoiYnV5ZXI1QGdtYWlsLmNvbSIsInJvbGVJZCI6MiwiaWF0IjoxNjgzMjg5NzA1LCJleHAiOjE3MTQ4NDczMDV9.NBC08-jFbjBy3rZA7Q6exQ-USvlBXix0y88H3Egp41M';
        const response = await request(app)
            .get('/api/v1/notification/vendor/all')
            .set('Authorization', `bearer ${userToken}`)
        expect(response.statusCode).toBe(200);
    });

    test('no notification ', async () => {

        const userToken= 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMyY2M5NTNmLTM4ZjktNDk3OS1iNjIwLWNkZWQ1MzA0YTBhNiIsImZ1bGxuYW1lIjoiYnV5ZXIzIiwiZW1haWwiOiJidXllcjNAZ21haWwuY29tIiwicm9sZUlkIjozLCJpYXQiOjE2ODMyOTM0NDYsImV4cCI6MTcxNDg1MTA0Nn0.H85Mgz-GWLeuxKs9zXNiy9eCraKEKkAI048KO3w7pHA';
        const response = await request(app)
            .get('/api/v1/notification/vendor/all')
            .set('Authorization', `bearer ${userToken}`)
        expect(response.statusCode).toBe(404);
    });
    test('get one notification', async () => {

        const userToken= 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijk5NWJiYzY2LTZhMjgtNDNhMC05NDY3LTMwMDM2NTQyNDIwYyIsImVtYWlsIjoiYnV5ZXI1QGdtYWlsLmNvbSIsInJvbGVJZCI6MiwiaWF0IjoxNjgzMjg5NzA1LCJleHAiOjE3MTQ4NDczMDV9.NBC08-jFbjBy3rZA7Q6exQ-USvlBXix0y88H3Egp41M';
        const response = await request(app)
            .get('/api/v1/notification/vendor/all/daa7ea52-71e7-412d-b250-8a0cf3dd8215')
            .set('Authorization', `bearer ${userToken}`)

        expect(response.statusCode).toBe(200);
    });
    test('get unavailable notification', async () => {

        const userToken= 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijk5NWJiYzY2LTZhMjgtNDNhMC05NDY3LTMwMDM2NTQyNDIwYyIsImVtYWlsIjoiYnV5ZXI1QGdtYWlsLmNvbSIsInJvbGVJZCI6MiwiaWF0IjoxNjgzMjg5NzA1LCJleHAiOjE3MTQ4NDczMDV9.NBC08-jFbjBy3rZA7Q6exQ-USvlBXix0y88H3Egp41M';
        const response = await request(app)
            .get('/api/v1/notification/vendor/all/daa7ea52-71e7-412d-b250-8a0cf3dd8219')
        .set('Authorization', `bearer ${userToken}`)

        expect(response.statusCode).toBe(404);
    });
    test('get unavailable notification', async () => {

        const userToken= 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijk5NWJiYzY2LTZhMjgtNDNhMC05NDY3LTMwMDM2NTQyNDIwYyIsImVtYWlsIjoiYnV5ZXI1QGdtYWlsLmNvbSIsInJvbGVJZCI6MiwiaWF0IjoxNjgzMjg5NzA1LCJleHAiOjE3MTQ4NDczMDV9.NBC08-jFbjBy3rZA7Q6exQ-USvlBXix0y88H3Egp41M';
        const response = await request(app)
            .delete('/api/v1/notification/vendor/all/delete/daa7ea52-71e7-412d-b250-8a0cf3dd8217')
            .set('Authorization', `bearer ${userToken}`)

        expect(response.statusCode).toBe(200);
    });
    test('get unavailable notification', async () => {

        const userToken= 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijk5NWJiYzY2LTZhMjgtNDNhMC05NDY3LTMwMDM2NTQyNDIwYyIsImVtYWlsIjoiYnV5ZXI1QGdtYWlsLmNvbSIsInJvbGVJZCI6MiwiaWF0IjoxNjgzMjg5NzA1LCJleHAiOjE3MTQ4NDczMDV9.NBC08-jFbjBy3rZA7Q6exQ-USvlBXix0y88H3Egp41M';
        const response = await request(app)
            .delete('/api/v1/notification/vendor/all/1/delete')
            .set('Authorization', `bearer ${userToken}`)

        expect(response.statusCode).toBe(200);
    });
});