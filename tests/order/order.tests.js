import request from "supertest";
import { expect, describe, test } from "@jest/globals";
import models from "../../src/database/models";
import app from "../../src/app";
import PasswordReminder from "../../src/controllers/user/password.reminder";
import job from "../../index.backup";
import JwtUtility from "../../src/utils/jwt.util";
import { execSync } from "child_process";
import { orderCart } from "../mocks/order.mock";
import { buyerToken, sellerToken } from "../mocks/order.mock";
import {
  notifyVendorOnProductCreate,
  notifyVendorOnProductDeletion,
} from "../../src/controllers/notification/notifications.controller";
import db from "../../src/database/models";

describe("orders test route", () => {
  beforeAll(async () => {
    execSync("npx sequelize-cli db:seed:all");
  });
  test("It should return 201 when creating order passed", async () => {
    const token = buyerToken;
    const decodedToken = JwtUtility.verifyToken(token);
    const id = decodedToken.id;
    const { cartId } = orderCart;
    const expectedDeliveryDate = new Date();
    const orderData = {
      userId: id,
      cartId,
      expected_delivery_date: expectedDeliveryDate,
    };
    console.log(orderData);
    const cart = await models.Cart.findOne({
      where: { id: cartId },
    });
    const response = await request(app)
      .post(`/api/v1/order/create`)
      .set("Authorization", `Bearer ${token}`)
      .send(orderData);
    expect(response.status).toBe(201);
    expect(response.body.message).toBe(
      "🍀 Your order has been added successfully."
    );
    expect(response.body.data.cartId).toBe(orderData.cartId);
    expect(response.body.data.total).toBe(cart.total);
    expect(response.body.data.quantity).toBe(cart.quantity);
  });

  test("It should return 500 when request is invalid", async () => {
    const token = buyerToken;
    const response = await request(app)
      .post(`/api/v1/order/create`)
      .set("Authorization", `Bearer ${token}`)
      .send({}); // Invalid request
    expect(response.status).toBe(500);
    expect(response.body.message).toBeDefined();
  });

  test("It should return 500 when request is invalid", async () => {
    const token = buyerToken;
    const response = await request(app)
      .post(`/api/v1/order`)
      .set("Authorization", `Bearer ${token}`)
      .send({}); // Invalid request
    expect(response.status).toBe(500);
    expect(response.body.message).toBeDefined();
  });
  // test("It shoud return 201 when creating order passed", async () => {
  //   const token = buyerToken;
  //   console.log("token", token);
  //   const decodedToken = JwtUtility.verifyToken(token);
  //   const id = decodedToken.id;
  //   console.log("***** decodedToken*****", id);
  //   const { cartId } = orderCart;
  //   const expectedDeliveryDate = new Date();
  //   const order = await models.Order.create({
  //     userId: id,
  //     cartId,
  //     expected_delivery_date: expectedDeliveryDate,
  //   });
  //   const cart = await models.Cart.findOne({
  //     where: { id: cartId },
  //   });
  //   console.log("**** cart *****", cart);
  //   console.log("***** Order*****", order);
  //   const response = await request(app)
  //     .post(`/api/v1/order/create`)
  //     .set("Authorization", `Bearer ${token}`)
  //     .send(order);
  //   expect(response.status).toBe(201);
  //   expect(response.body.message).toBe(
  //     "🍀 Your order has been added successfully."
  //   );
  //   expect(response.body.data.cartId).toBe(orderData.cartId);
  //   expect(response.body.data.total).toBe(cart.total);
  //   expect(response.body.data.quantity).toBe(cart.quantity);
  //   expect(response.body.data.expected_delivery_date).toBe(
  //     orderData.expected_delivery_date.toISOString()
  //   );
  // });

  afterAll(async () => {
    PasswordReminder.stop();
    job.stop();
    execSync("npx sequelize-cli db:seed:undo:all");
  });
});
