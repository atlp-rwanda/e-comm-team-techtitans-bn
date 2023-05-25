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
import {createCart,SufcreateCart,IncreateCart} from "../mocks/cart.mock";

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
describe('Adding and view cart', () => {

    test('Buyer Add to cart', async () => {

        const userToken= 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMyY2M5NTNmLTM4ZjktNDk3OS1iNjIwLWNkZWQ1MzA0YTBhNiIsImZ1bGxuYW1lIjoiYnV5ZXIzIiwiZW1haWwiOiJidXllcjNAZ21haWwuY29tIiwicm9sZUlkIjozLCJpYXQiOjE2ODMyOTM0NDYsImV4cCI6MTcxNDg1MTA0Nn0.H85Mgz-GWLeuxKs9zXNiy9eCraKEKkAI048KO3w7pHA';
        const response = await request(app)
            .post('/api/v1/cart/add-to-cart')
            .set('Authorization', `bearer ${userToken}`)
            .send(createCart);

        expect(response.statusCode).toBe(201);
    });
    test('Cart Invalid Product', async () => {

        const userToken= 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMyY2M5NTNmLTM4ZjktNDk3OS1iNjIwLWNkZWQ1MzA0YTBhNiIsImZ1bGxuYW1lIjoiYnV5ZXIzIiwiZW1haWwiOiJidXllcjNAZ21haWwuY29tIiwicm9sZUlkIjozLCJpYXQiOjE2ODMyOTM0NDYsImV4cCI6MTcxNDg1MTA0Nn0.H85Mgz-GWLeuxKs9zXNiy9eCraKEKkAI048KO3w7pHA';
        const response = await request(app)
            .post('/api/v1/cart/add-to-cart')
            .set('Authorization', `bearer ${userToken}`)
            .send(IncreateCart);

        expect(response.statusCode).toBe(400);
    });
    test('Buyer Insuffient Product', async () => {

        const userToken= 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMyY2M5NTNmLTM4ZjktNDk3OS1iNjIwLWNkZWQ1MzA0YTBhNiIsImZ1bGxuYW1lIjoiYnV5ZXIzIiwiZW1haWwiOiJidXllcjNAZ21haWwuY29tIiwicm9sZUlkIjozLCJpYXQiOjE2ODMyOTM0NDYsImV4cCI6MTcxNDg1MTA0Nn0.H85Mgz-GWLeuxKs9zXNiy9eCraKEKkAI048KO3w7pHA';
        const response = await request(app)
            .post('/api/v1/cart/add-to-cart')
            .set('Authorization', `bearer ${userToken}`)
            .send(SufcreateCart);

        expect(response.statusCode).toBe(400);
    });
    test('Buyer view invalid token', async () => {

        const userToken= 'JhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMyY2M5NTNmLTM4ZjktNDk3OS1iNjIwLWNkZWQ1MzA0YTBhNiIsImZ1bGxuYW1lIjoiYnV5ZXIzIiwiZW1haWwiOiJidXllcjNAZ21haWwuY29tIiwicm9sZUlkIjozLCJpYXQiOjE2ODMyOTM0NDYsImV4cCI6MTcxNDg1MTA0Nn0.H85Mgz-GWLeuxKs9zXNiy9eCraKEKkAI048KO3w7pHA';
        const response = await request(app)
            .post('/api/v1/cart/add-to-cart')
            .set('Authorization', `bearer ${userToken}`)
            .send(createCart);

        expect(response.statusCode).toBe(500);
    });
    test('Buyer view cart', async () => {

        const userToken= 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMyY2M5NTNmLTM4ZjktNDk3OS1iNjIwLWNkZWQ1MzA0YTBhNiIsImZ1bGxuYW1lIjoiYnV5ZXIzIiwiZW1haWwiOiJidXllcjNAZ21haWwuY29tIiwicm9sZUlkIjozLCJpYXQiOjE2ODMyOTM0NDYsImV4cCI6MTcxNDg1MTA0Nn0.H85Mgz-GWLeuxKs9zXNiy9eCraKEKkAI048KO3w7pHA';
        const response = await request(app)
            .get('/api/v1/cart/view-cart')
            .set('Authorization', `bearer ${userToken}`)

        expect(response.statusCode).toBe(200);
    });
    test('Buyer view cart', async () => {

        const userToken= 'k3OS1iNjIwLWNkZWQ1MzA0YTBhNiIsImZ1bGxuYW1lIjoiYnV5ZXIzIiwiZW1haWwiOiJidXllcjNAZ21haWwuY29tIiwicm9sZUlkIjozLCJpYXQiOjE2ODMyMDU5NzIsImV4cCI6MTY4MzI5MjM3Mn0.y5gOtgrm0ondJLJ8Roo6o6Zq8dcPyHjlX3nsciAXxiE';
        const response = await request(app)
            .get('/api/v1/cart/view-cart')
            .set('Authorization', `bearer ${userToken}`)

        expect(response.statusCode).toBe(500);
    });
    // test('Buyer clear cart', async () => {
    //
    //     const userToken= 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMyY2M5NTNmLTM4ZjktNDk3OS1iNjIwLWNkZWQ1MzA0YTBhNiIsImZ1bGxuYW1lIjoiYnV5ZXIzIiwiZW1haWwiOiJidXllcjNAZ21haWwuY29tIiwicm9sZUlkIjozLCJpYXQiOjE2ODMyMDU5NzIsImV4cCI6MTY4MzI5MjM3Mn0.y5gOtgrm0ondJLJ8Roo6o6Zq8dcPyHjlX3nsciAXxiE';
    //     const response = await request(app)
    //         .get('/api/v1/cart/view-cart')
    //         .set('Authorization', `bearer ${userToken}`)
    //
    //     expect(response.statusCode).toBe(200);
    // });
    test('Buyer view empty cart', async () => {
        const userToken= 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjhkYjg4OTU2LWE5YzktNDg4ZC05NjkyLWM1NWQ1NDE4YmQ5OCIsImZ1bGxuYW1lIjoiYnV5ZXIxIiwiZW1haWwiOiJidXllcjFAZ21haWwuY29tIiwicm9sZUlkIjozLCJpYXQiOjE2ODMzMjQ1NzUsImV4cCI6MTcxNDg4MjE3NX0.LPNIF6aa8sFTsB8BjfedEVKj0gU5vbEsxKsjdV2uCAQ';
        const response = await request(app)
            .get('/api/v1/cart/view-cart')
            .set('Authorization', `bearer ${userToken}`)
        expect(response.statusCode).toBe(404);
    });
});