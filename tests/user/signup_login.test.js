import request from 'supertest';
import app from '../../src/app';
import {
  successRegistration,
  theSuccessLoginCredentials,
  unSuccessfullLoginCredentials,
  profile,
} from '../mocks/user.mock';
import { expect, describe, test } from '@jest/globals';
import JwtUtility from "../../src/utils/jwt.util";
import {product} from "../mocks/product.mock";
import passwordReminder from "../../src/controllers/user/password.reminder";

let userTokens = '';
let userUuid = '';
const uuidRegex = new RegExp(
    '^[a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$',
    'i',
);
beforeAll(() => {
  passwordReminder.start();
});

afterAll(() => {
  passwordReminder.stop();
});
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
    const token = response.body.data.userToken;

    userTokens = token;
    expect(response.statusCode).toBe(200);
  });

  test('Successful Verification', async () => {
    const response = await request(app).get(
        `/api/v1/user/signup/${userTokens}`,
    );
    expect(response.statusCode).toBe(201);
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data.id).toMatch(uuidRegex);

    userUuid = response.body.data.id;
    expect(userUuid).toBeDefined();
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



  test('Successful update', async () => {
    const response = await request(app)
        .put(`/api/v1/user/profile/${userUuid}`)
        .send(profile);
    expect(response.statusCode).toBe(201);
  });

});
