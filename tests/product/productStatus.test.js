import request from 'supertest';
import { execSync } from 'child_process';
import { expect, describe, test } from '@jest/globals';
import models from "../../src/database/models";
import app from '../../src/app';
import PasswordReminder from '../../src/controllers/user/password.reminder';
import {
  product,
  wrongProductStructure,
  outOfStockProduct,
} from '../mocks/product.mock';
import JwtUtility from '../../src/utils/jwt.util';
describe('Product Routes', () => {
//   beforeAll(async () => {
//     await execSync("npx sequelize-cli db:seed --seed 20230429152955-create-category.js");
//     await execSync("npx sequelize-cli db:seed --seed 20230429153310-create-product.js");
//    });
  
  test('Changing the product status to out_of_stock but the id is not found', async () => {
    const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYyYzg1Y2JiLTVkZjktNDkxMy1iMWU1LTUzZjczODMxZDZmMyIsImVtYWlsIjoic2VsbGVyQGdtYWlsLmNvbSIsInJvbGVJZCI6MiwiaWF0IjoxNjgzMTAwODkwLCJleHAiOjQ4Mzg4NjA4OTB9.4Oossck1yxHUW0uTb7E89gu-NfLpJgt6azaqW9s61oo";
    let id = 'b97391ee-dbf6-40ac-9490-575076785677'
  const response = await request(app)
  .get(`/api/v1/product/update/stockStatus/2/${id}`)
  .set("Authorization", `Bearer ${token}`);
  expect(response.status).toBe(404);
  });
  test('Changing the product status to out_of_stock successfully', async () => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYyYzg1Y2JiLTVkZjktNDkxMy1iMWU1LTUzZjczODMxZDZmMyIsImVtYWlsIjoic2VsbGVyQGdtYWlsLmNvbSIsInJvbGVJZCI6MiwiaWF0IjoxNjgzMTAwODkwLCJleHAiOjQ4Mzg4NjA4OTB9.4Oossck1yxHUW0uTb7E89gu-NfLpJgt6azaqW9s61oo";

      let id = 'b97391ee-dbf6-40ac-9490-575076785672'
    const response = await request(app)
    .get(`/api/v1/product/update/stockStatus/2/${id}`)
    .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.data.stock).toBe("out of stock")
  });
  test('Changing the product status to expired but the id is not found', async () => {
    // const nonExistentId = '413c45dd-198e-42cc-a1c9-a1358d6e92ae';
    const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYyYzg1Y2JiLTVkZjktNDkxMy1iMWU1LTUzZjczODMxZDZmMyIsImVtYWlsIjoic2VsbGVyQGdtYWlsLmNvbSIsInJvbGVJZCI6MiwiaWF0IjoxNjgzMTAwODkwLCJleHAiOjQ4Mzg4NjA4OTB9.4Oossck1yxHUW0uTb7E89gu-NfLpJgt6azaqW9s61oo";

    let id = 'b97391ee-dbf6-40ac-9490-575076785677'
  const response = await request(app)
  .get(`/api/v1/product/update/stockStatus/3/${id}`)
  .set("Authorization", `Bearer ${token}`);
  expect(response.status).toBe(404);
  });
  test('Changing the product status to expired sucessfully', async () => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYyYzg1Y2JiLTVkZjktNDkxMy1iMWU1LTUzZjczODMxZDZmMyIsImVtYWlsIjoic2VsbGVyQGdtYWlsLmNvbSIsInJvbGVJZCI6MiwiaWF0IjoxNjgzMTAwODkwLCJleHAiOjQ4Mzg4NjA4OTB9.4Oossck1yxHUW0uTb7E89gu-NfLpJgt6azaqW9s61oo";
      let id = 'b97391ee-dbf6-40ac-9490-575076785672'
    const response = await request(app)
    .get(`/api/v1/product/update/stockStatus/3/${id}`)
    .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.data.stock).toBe("expired")
  });

  test('Changing the product status to available but the id is not found', async () => {
    // const nonExistentId = '413c45dd-198e-42cc-a1c9-a1358d6e92ae';
    const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYyYzg1Y2JiLTVkZjktNDkxMy1iMWU1LTUzZjczODMxZDZmMyIsImVtYWlsIjoic2VsbGVyQGdtYWlsLmNvbSIsInJvbGVJZCI6MiwiaWF0IjoxNjgzMTAwODkwLCJleHAiOjQ4Mzg4NjA4OTB9.4Oossck1yxHUW0uTb7E89gu-NfLpJgt6azaqW9s61oo";

    let id = 'b97391ee-dbf6-40ac-9490-575076785677'
  const response = await request(app)
  .get(`/api/v1/product/update/stockStatus/1/${id}`)
  .set("Authorization", `Bearer ${token}`);
  expect(response.status).toBe(404);
  });

  test('Changing the product status to expired sucessfully', async () => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYyYzg1Y2JiLTVkZjktNDkxMy1iMWU1LTUzZjczODMxZDZmMyIsImVtYWlsIjoic2VsbGVyQGdtYWlsLmNvbSIsInJvbGVJZCI6MiwiaWF0IjoxNjgzMTAwODkwLCJleHAiOjQ4Mzg4NjA4OTB9.4Oossck1yxHUW0uTb7E89gu-NfLpJgt6azaqW9s61oo";
      let id = 'b97391ee-dbf6-40ac-9490-575076785672'
    const response = await request(app)
    .get(`/api/v1/product/update/stockStatus/1/${id}`)
    .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.data.stock).toBe("available")
  });
  afterAll(() => {
    PasswordReminder.stop(); // Stop the passwordReminder service
    // Stop any other asynchronous tasks that are still running
    // ...
  });
});