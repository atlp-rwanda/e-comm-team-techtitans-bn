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
describe('Searching the product', () => {

    test('Search product', async () => {
        const response = await request(app)
            .get('/api/v1/product/list/search?name=ipad&price=2000')

        expect(response.statusCode).toBe(200);
    });
    test('Unavalable search product', async () => {

        const response = await request(app)
            .get(`/api/v1/product/list/search?name=maximo&price=20000`)


        expect(response.statusCode).toBe(404);
    });
});