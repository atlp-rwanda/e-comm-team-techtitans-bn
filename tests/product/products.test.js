import request from "supertest";
import { expect, describe, test } from "@jest/globals";
import models from "../../src/database/models";
import app from "../../src/app";
import PasswordReminder from "../../src/controllers/user/password.reminder";
import job from "../../index.backup";
import {
  product,
  sellerToken,
  buyerToken,
  wrongProductStructure,
  addProduct,
  wrongCategoryStructure,
  wrongCategoryProduct,
  categoryExist,
  existProduct,
  updatedProduct,
} from "../mocks/product.mock";
import JwtUtility from "../../src/utils/jwt.util";
import { execSync } from "child_process";
import {
  notifyVendorOnProductCreate,
  notifyVendorOnProductDeletion,
} from "../../src/controllers/notification/notifications.controller";
import db from "../../src/database/models";

const User = db.users;

describe("Product Routes", () => {
  beforeAll(async () => {
    execSync("npx sequelize-cli db:seed:all");
  });
  // ********* Start of Category Test *********
  test("Create Product category", async () => {
    const response = await request(app)
      .post(`/api/v1/category/create`)
      .send({ name: "mock category" });
    expect(response.status).toBe(201);
  });
  test("Create Product category", async () => {
    const response = await request(app)
      .post(`/api/v1/category/create`)
      .send(wrongCategoryStructure);
    expect(response.status).toBe(500);
  });
  test("Test if Category is already Exist", async () => {
    const response = await request(app)
      .post(`/api/v1/category/create`)
      .send(categoryExist);
    const existingCategory = await models.Category.findOne({
      where: { name: categoryExist.name },
    });
    if (existingCategory) {
      expect(response.statusCode).toBe(409);
    }
  });
  test("It should display list of category", async () => {
    const response = await request(app).get(`/api/v1/category`);
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("success");
  });
  // ************** End of Category Test **************

  // ************** Start of  Create Product Test **************

  test("Create one product", async () => {
    let { name, price, quantity, categoryId, description, expiryDate } =
      product;

    let images = product.images || [];
    const token = sellerToken;
    const decodedToken = JwtUtility.verifyToken(token);
    const { id } = decodedToken;

    // Create a new object that contains only the required fields
    const newProduct = {
      name,
      price,
      quantity,
      categoryId,
      description,
      expiryDate,
      images,
    };

    // Validate that all required fields are present and have valid values
    if (
      !newProduct.name ||
      !newProduct.price ||
      !newProduct.quantity ||
      !newProduct.categoryId ||
      !newProduct.description ||
      !newProduct.expiryDate ||
      !newProduct.images
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const createdProduct = await models.Product.create({
      vendorId: id,
      ...addProduct,
    });
    await notifyVendorOnProductCreate(createdProduct);
    const response = await request(app)
      .post(`/api/v1/product/create/`)
      .set("Authorization", `Bearer ${token}`)
      .send(newProduct);
    expect(response.status).toBe(201);
  });
  test("It should return 500 because category is not exist", async () => {
    let { name, price, quantity, categoryId, description, expiryDate } =
      wrongCategoryProduct;

    let images = wrongCategoryProduct.images || [];
    const token = sellerToken;
    const decodedToken = JwtUtility.verifyToken(token);
    const { id } = decodedToken;

    // Create a new object that contains only the required fields
    const newProduct = {
      name,
      price,
      quantity,
      categoryId,
      description,
      expiryDate,
      images,
    };

    // Validate that all required fields are present and have valid values
    if (
      !newProduct.name ||
      !newProduct.price ||
      !newProduct.quantity ||
      !newProduct.categoryId ||
      !newProduct.description ||
      !newProduct.expiryDate ||
      !newProduct.images
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const createdProduct = await models.Product.create({
      vendorId: id,
      ...addProduct,
    });
    await notifyVendorOnProductCreate(createdProduct);
    const response = await request(app)
      .post(`/api/v1/product/create/`)
      .set("Authorization", `Bearer ${token}`)
      .send(newProduct);
    expect(response.status).toBe(500);
  });
  test("It should return that your unauthorized to perform this action", async () => {
    let { name, price, quantity, categoryId, description, expiryDate } =
      product;

    let images = product.images || [];
    const token = buyerToken;
    const decodedToken = JwtUtility.verifyToken(token);
    const { id } = decodedToken;

    // Create a new object that contains only the required fields
    const newProduct = {
      name,
      price,
      quantity,
      categoryId,
      description,
      expiryDate,
      images,
    };

    // Validate that all required fields are present and have valid values
    if (
      !newProduct.name ||
      !newProduct.price ||
      !newProduct.quantity ||
      !newProduct.categoryId ||
      !newProduct.description ||
      !newProduct.expiryDate ||
      !newProduct.images
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const createdProduct = await models.Product.create({
      vendorId: id,
      ...addProduct,
    });
    await notifyVendorOnProductCreate(createdProduct);
    const response = await request(app)
      .post(`/api/v1/product/create/`)
      .set("Authorization", `Bearer ${token}`)
      .send(newProduct);
    expect(response.status).toBe(403);
  });
  test("testing if product is already exist", async () => {
    let { name, price, quantity, categoryId, description, expiryDate } =
      existProduct;

    let images = existProduct.images || [];
    const token = sellerToken;
    const decodedToken = JwtUtility.verifyToken(token);
    const { id } = decodedToken;

    // Create a new object that contains only the required fields
    const newProduct = {
      name,
      price,
      quantity,
      categoryId,
      description,
      expiryDate,
      images,
    };
    const response = await request(app)
      .post(`/api/v1/product/create/`)
      .set("Authorization", `Bearer ${token}`)
      .send(existProduct);
    const vendorProduct = await models.Product.findOne({
      where: { name, vendorId: id },
    });
    if (vendorProduct) {
      expect(response.status).toBe(409);
    }
  });
  test("If an error gets caught", async () => {
    const token = sellerToken;
    const response = await request(app)
      .post(`/api/v1/product/create`)
      .set("Authorization", `Bearer ${token}`)
      .send(wrongProductStructure);
    expect(response.statusCode).toBe(400);
  });

  // *************End of Add and List product Test ************//

  //  ************* Update Product Routes Test ************//

  test("It should return 200 for updating product", async () => {
    let { name, price, quantity, categoryId, description, expiryDate } =
      product;

    let images = product.images || [];
    const token = sellerToken;
    const decodedToken = JwtUtility.verifyToken(token);
    const { id } = decodedToken;

    // Create a new object that contains only the required fields
    const newProduct = {
      name,
      price,
      quantity,
      categoryId,
      description,
      expiryDate,
      images,
    };

    // Validate that all required fields are present and have valid values
    if (
      !newProduct.name ||
      !newProduct.price ||
      !newProduct.quantity ||
      !newProduct.categoryId ||
      !newProduct.description ||
      !newProduct.expiryDate ||
      !newProduct.images
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const createdProduct = await models.Product.create({
      vendorId: id,
      ...addProduct,
    });
    await notifyVendorOnProductCreate(createdProduct);
    const productId = createdProduct.id;

    const response = await request(app)
      .put(`/api/v1/product/update/${productId}/`)
      .set("Authorization", `Bearer ${token}`)
      .send(updatedProduct);
    expect(response.status).toBe(200);
  });
  test("It should return 404 when product not Found", async () => {
    const token = sellerToken;
    const decodedToken = JwtUtility.verifyToken(token);
    const { id } = decodedToken;

    const productId = "c60de84e-3b1b-4168-88c3-5f6967c15aa8";

    const response = await request(app)
      .put(`/api/v1/product/update/${productId}/`)
      .set("Authorization", `Bearer ${token}`)
      .send(updatedProduct);
    const products = await models.Product.findOne({
      where: { id: productId, vendorId: id },
    });
    if (!products) {
      expect(response.status).toBe(404);
    }
  });
  test("It should return 500 because category is not exist", async () => {
    let { name, price, quantity, categoryId, description, expiryDate } =
      wrongCategoryProduct;

    let images = wrongCategoryProduct.images || [];
    const token = sellerToken;
    const decodedToken = JwtUtility.verifyToken(token);
    const { id } = decodedToken;

    // Create a new object that contains only the required fields
    const newProduct = {
      name,
      price,
      quantity,
      categoryId: "f0c3a3d3-8c87-4e36-bb9d-1632d1008e81",
      description,
      expiryDate,
      images,
    };

    // Validate that all required fields are present and have valid values
    if (
      !newProduct.name ||
      !newProduct.price ||
      !newProduct.quantity ||
      !newProduct.categoryId ||
      !newProduct.description ||
      !newProduct.expiryDate ||
      !newProduct.images
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const createdProduct = await models.Product.create({
      vendorId: id,
      ...addProduct,
    });
    await notifyVendorOnProductCreate(createdProduct);
    const productId = createdProduct.id;

    const response = await request(app)
      .put(`/api/v1/product/update/${productId}/`)
      .set("Authorization", `Bearer ${token}`)
      .send(newProduct);
    expect(response.status).toBe(500);
  });

  afterAll(async () => {
    PasswordReminder.stop();
    job.stop();
    await execSync("npx sequelize-cli db:seed:undo:all");
  });
});
// ************* End of ADD Product Routes Test ************//

describe("category Routes Tests", () => {
  test("it should return 404 if category is not found", async () => {
    const response = await request(app).get(`/api/v1/category`);
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      status: "fail",
      message: "🚫 No category found",
    });
  });
  test("it should return 500 if there is an error", async () => {
    // Mock the findAndCountAll method to throw an error
    models.Category.findAndCountAll = jest
      .fn()
      .mockRejectedValue(new Error("Database connection error"));

    const response = await request(app).get(`/api/v1/category`);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      status: "fail",
      message: "Database connection error",
    });
  });
});
