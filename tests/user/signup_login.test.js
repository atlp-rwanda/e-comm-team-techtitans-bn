import request from 'supertest';
import app from '../../src/app';
import {successRegistration, theSuccessLoginCredentials, unSuccessfullLoginCredentials} from '../mocks/user.mock';
import { expect, describe, test } from '@jest/globals';
let userTokens='';
describe('User Test (Signup and login)', () => {
    /*
   **********************************************
   *  🟢 Signup a new User *
   **********************************************
   */
    test('Successful Signup', async () => {
        const response = await request(app)
            .post('/api/v1/user/signup')
            .send(successRegistration);
        // console.log(response)
        const token=response.body.data.userToken;
        userTokens=token;
        expect(response.statusCode).toBe(200);
    });

    test('Successful Verification', async () => {
        const response = await request(app)
            .get(`/api/v1/user/signup/${userTokens}`)
        expect(response.statusCode).toBe(201);
    });
    /*
   **********************************************
   * 🛑 End Signup a new User *
   **********************************************
   */

    /*
  **********************************************
  *  🟢 Login for verified User *
  **********************************************
  */
    test('Successful Login', async () => {
        const response = await request(app)
            .post('/api/v1/user/login')
            .send(theSuccessLoginCredentials);
        expect(response.statusCode).toBe(200);
    });

    // Login for unverified User

    test('Unsuccessful Login', async () => {
        const response = await request(app)
            .post('/api/v1/user/login')
            .send(unSuccessfullLoginCredentials);
        expect(response.statusCode).toBe(401);
    });
    /*
  **********************************************
  * 🛑 End login test *
  **********************************************
  */
});