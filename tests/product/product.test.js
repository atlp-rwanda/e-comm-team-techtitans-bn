import request from 'supertest';
import { expect, describe, test } from '@jest/globals';
import models from '../../src/database/models';
import app from '../../src/app';
import PasswordReminder from '../../src/controllers/user/password.reminder';
import {
  product,
  wrongProductStructure,
  outOfStockProduct,
} from '../mocks/product.mock';
import JwtUtility from '../../src/utils/jwt.util';

describe('Product Routes', () => {
  test('Displaying one product', async () => {
    const newProduct = await models.Product.create({ product });
    const fetchedProduct = await models.Product.findOne({
      where: {
        id: newProduct.id,
      },
    });
    const { id } = fetchedProduct.dataValues;
    const response = await request(app).get(`/api/v1/product/${id}`);
    expect(response.status).toBe(200);
  });

  test('Whether the product to display exists in our db', async () => {
    const nonExistentId = '413c45dd-198e-42cc-a1c9-a1358d6e92ae';
    const response = await request(app).get(`/api/v1/product/${nonExistentId}`);
    const fetchedProduct = await models.Product.findOne({
      where: {
        id: nonExistentId,
      },
    });
    if (fetchedProduct === null) {
      expect(response.status).toBe(404);
    }
  });

  test('Catch the Internal Server error', async () => {
    const newProduct = await models.Product.create({ product });
    const fetchedProduct = await models.Product.findOne({
      where: {
        id: newProduct.id,
      },
    });
    const id = fetchedProduct.dataValues.price; // Wrong ID to provide a 500 statusCode
    const response = await request(app).get(`/api/v1/product/${id}`);
    expect(response.status).toBe(500);
  });

  afterAll(() => {
    PasswordReminder.stop(); // Stop the passwordReminder service
    // Stop any other asynchronous tasks that are still running
    // ...
  });
});
