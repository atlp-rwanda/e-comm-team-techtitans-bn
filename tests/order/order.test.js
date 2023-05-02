import request from "supertest";
import { expect, describe, test } from "@jest/globals";
import models from "../../src/database/models";
import app from "../../src/app";
import PasswordReminder from "../../src/controllers/user/password.reminder";
import job from "../../index.backup";
import JwtUtility from "../../src/utils/jwt.util";
import { execSync } from "child_process";
import { orderCart } from "../mocks/order.mock";
import { buyerToken } from "../mocks/product.mock";
import {
  notifyVendorOnProductCreate,
  notifyVendorOnProductDeletion,
} from "../../src/controllers/notification/notifications.controller";
import db from "../../src/database/models";

describe("orders test route", () => {
  beforeAll(async () => {
    execSync("npx sequelize-cli db:seed:all");
  });

  test("It shoud return 201 when creating order passed", async () => {
    const token = buyerToken;
    const decodedToken = JwtUtility.verifyToken(token);
    const { id } = decodedToken;
    const { cartId } = orderCart;
    const expectedDeliveryDate = new Date();
    const order = await models.Order.create({
      userId: id,
      cartId,
      expected_delivery_date: expectedDeliveryDate,
    });
    const response = await request(app)
      .post(`/api/v1/order/create`)
      .set("Authorization", `Bearer ${token}`)
      .send(orderCart);
    expect(response.status).toBe(201);
  });

  afterAll(async () => {
    PasswordReminder.stop();
    job.stop();
    execSync("npx sequelize-cli db:seed:undo:all");
  });
});
