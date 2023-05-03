import request from 'supertest';
import app from '../../src/app';
import {
  successRegistration,
  theSuccessLoginCredentials,
  unSuccessfullLoginCredentials,
  profile,
  missingNameField,
  missingEmailField,
  invalidEmail,
  missingPasswordField,
  shortPassword,
  notAplhanumericPassword,
  missingConfirmPasswordField,
  passwordsNotMatching,
  wrongStructure,
  emailExists,
  expiredToken,
} from '../mocks/user.mock';
import PasswordReminder from '../../src/controllers/user/password.reminder';
import { expect, describe, test } from '@jest/globals';
import JwtUtility from '../../src/utils/jwt.util';
import { product } from '../mocks/product.mock';
import db from '../../src/database/models';
import passwordReminder from "../../src/controllers/user/password.reminder";
import {
  ExpiringProducts,
  notifyVendorProductOutOfStock
} from "../../src/controllers/notification/notifications.controller";
import job from "../../index.backup";

const User = db.users;

let userTokens = '';
let userUuid = '';
const uuidRegex = new RegExp(
    '^[a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$',
    'i',
);
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
describe('User Test (Signup and login)', () => {
  /*
   **********************************************
   *  🟢 Validation for Signup inputs *
   **********************************************
   */
  test('If an error gets caught', async () => {
    const response = await request(app)
        .post('/api/v1/user/signup')
        .send(wrongStructure);
    expect(response.statusCode).toBe(500);
  });
  test('If the email already exists', async () => {
    const response = await request(app)
        .post('/api/v1/user/signup')
        .send(emailExists);
    const emailAlreadyExists = await User.findOne({
      where: {
        email: emailExists.email,
      },
    });
    if (emailAlreadyExists !== null) {
      expect(response.statusCode).toBe(401);
    }
  });
  test('Whether the fullname input field is empty', async () => {
    const response = await request(app)
        .post('/api/v1/user/signup')
        .send(missingNameField);
    if (missingNameField.fullname.trim() === '') {
      expect(response.statusCode).toBe(401);
    }
  });
  test('Whether the email input field is empty', async () => {
    const response = await request(app)
        .post('/api/v1/user/signup')
        .send(missingEmailField);
    if (missingEmailField.email.trim() === '') {
      expect(response.statusCode).toBe(401);
    }
  });
  test('Whether the email is a valid email address', async () => {
    const response = await request(app)
        .post('/api/v1/user/signup')
        .send(invalidEmail);
    if (!/\S+@\S+\.\S+/.test(invalidEmail.email)) {
      expect(response.statusCode).toBe(401);
    }
  });
  test('Whether the password input field is empty', async () => {
    const response = await request(app)
        .post('/api/v1/user/signup')
        .send(missingPasswordField);
    if (missingPasswordField.password.trim() === '') {
      expect(response.statusCode).toBe(401);
    }
  });
  test('Whether the password is less than 8 characters', async () => {
    const response = await request(app)
        .post('/api/v1/user/signup')
        .send(shortPassword);
    if (shortPassword.password.trim().length < 8) {
      expect(response.statusCode).toBe(401);
    }
  });
  test('Whether the password is alphanumeric', async () => {
    const response = await request(app)
        .post('/api/v1/user/signup')
        .send(notAplhanumericPassword);
    if (
        !notAplhanumericPassword.password.match(
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/i,
        )
    ) {
      expect(response.statusCode).toBe(401);
    }
  });
  test('Whether the confirmPassword field is empty', async () => {
    const response = await request(app)
        .post('/api/v1/user/signup')
        .send(missingConfirmPasswordField);
    if (missingConfirmPasswordField.confirmPassword.trim() === '') {
      expect(response.statusCode).toBe(401);
    }
  });
  test('Whether both password and confirmPassword match', async () => {
    const response = await request(app)
        .post('/api/v1/user/signup')
        .send(passwordsNotMatching);
    if (
        passwordsNotMatching.password !== passwordsNotMatching.confirmPassword
    ) {
      expect(response.statusCode).toBe(401);
    }
  });
  /*
   **********************************************
   * 🛑 End Validation for Signup inputs *
   **********************************************
   */
  /*
   **********************************************
   *  🟢 Signup a new User *
   **********************************************
   */
  test('Successful Signup', async () => {
    const response = await request(app)
        .post('/api/v1/user/signup')
        .send(successRegistration);
    console.log("this is the response for signup", response.body.data.userToken);
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
});