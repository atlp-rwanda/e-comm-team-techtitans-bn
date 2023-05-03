import request from "supertest";
import app from "../../src/app";
import { expect, describe, test } from "@jest/globals";
import { Sequelize } from "../../src/database/models";
import { execSync } from "child_process";
// import db from "../../src/database/models";
import models from '../../src/database/models';
import passwordReminder from "../../src/controllers/user/password.reminder";

describe("sellers will be able to mark an order as shipped", () => {
  beforeAll(async () => {
   await execSync("npx sequelize-cli db:seed:all");
  });

  test("changing order status to shipped", async () => {
    // const Order = db.orders;
    const order = await models.Order.findOne({
      where: { id: 'daa7ea52-71e7-412d-b250-8a0cf3dd8245' },
    });
    let id = order.id;
    const path = `/api/v1/order/updatestatus/${id}`;
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYyYzg1Y2JiLTVkZjktNDkxMy1iMWU1LTUzZjczODMxZDZmMyIsImVtYWlsIjoic2VsbGVyQGdtYWlsLmNvbSIsInJvbGVJZCI6MiwiaWF0IjoxNjgzMTAwODkwLCJleHAiOjQ4Mzg4NjA4OTB9.4Oossck1yxHUW0uTb7E89gu-NfLpJgt6azaqW9s61oo";
    const response = await request(app)
      .put(path)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.data.status).toBe("shipped");
  });

  test("test for order whihc is not in the databse", async () => {
    //order that is not in the database
    let id = 'daa7ea52-71e7-412d-b250-8a0cf3dd8244';
    const path = `/api/v1/order/updatestatus/${id}`;
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYyYzg1Y2JiLTVkZjktNDkxMy1iMWU1LTUzZjczODMxZDZmMyIsImVtYWlsIjoic2VsbGVyQGdtYWlsLmNvbSIsInJvbGVJZCI6MiwiaWF0IjoxNjgzMTAwODkwLCJleHAiOjQ4Mzg4NjA4OTB9.4Oossck1yxHUW0uTb7E89gu-NfLpJgt6azaqW9s61oo";
    const response = await request(app)
      .put(path)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(401);
   
  });

  afterAll(() => {
    passwordReminder.stop(); // Stop the passwordReminder service
    // Stop any other asynchronous tasks that are still running
    // ...
  });
});
