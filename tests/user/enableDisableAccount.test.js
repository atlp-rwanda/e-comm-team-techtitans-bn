import request from 'supertest';
import app from '../../src/app';
import { expect, describe, test } from '@jest/globals';
import {
  successRegistration,
  theSuccessLoginCredentials,
  unSuccessfullLoginCredentials,
  profile,enableDisableUser
} from '../mocks/user.mock';
import db from '../../src/database/models';

const User = db.users;

let uuid = User.id;

test('account status', async () => {
  const response = await request(app)
    .put(`/api/v1/user/updateAccountStatus/${uuid}`)
    .send(enableDisableUser);
  
  expect(response.status).toBe(401);
});