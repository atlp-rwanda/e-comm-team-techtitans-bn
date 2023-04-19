import request from "supertest";
import { expect, describe, test } from "@jest/globals";
import models from "../../src/database/models";
import app from "../../src/app";
import PasswordReminder from "../../src/controllers/user/password.reminder";
import { product, outOfStockProduct } from "../mocks/product.mock";
import JwtUtility from "../../src/utils/jwt.util";

describe("Product Routes", () => {
  test("Create one product", async () => {
    let { name, price, quantity, categoryId, description, expiryDate } =
      product;

    let images = product.images || [];
    const categoryName = "Electronics";
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJyaWNoYXJkQGdtYWlsLmNvbSIsInJvbGVJZCI6MiwiaWF0IjoxNjgxODk0MjIxLCJleHAiOjE2ODE5ODA2MjF9.vwMNao_7iJKsVLUBHxoujc0I3Ut-Bq6doopYIq3p8d4";
    const decodedToken = JwtUtility.verifyToken(token);
    const { id } = decodedToken;
    const category = await models.Category.create({
      name: categoryName,
    });
    const existingCategory = await models.Category.findOne({
      where: { name: categoryName },
    });
    const newCategoryId = existingCategory.dataValues.id;
    // console.log("Category Id", newCategoryId);
    // let categoryId = product.categoryId;
    categoryId = newCategoryId;
    // console.log("product IDS", product);
    let addedProduct = {
      vendorId: id,
      name,
      price,
      quantity,
      categoryId,
      description,
      expiryDate,
      images,
    };
    // console.log("Added Product", addedProduct);
    // const newProduct = await models.Product.create({addedProduct});
    // console.log("New Product", newProduct);

    const response = await request(app)
      .post(`/api/v1/product/create`)
      .set("Authorization", `Bearer ${token}`)
      .send(addedProduct);
    expect(response.status).toBe(201);
  });

  afterAll(() => {
    PasswordReminder.stop(); // Stop the passwordReminder service
    // Stop any other asynchronous tasks that are still running
    // ...
  });
});

