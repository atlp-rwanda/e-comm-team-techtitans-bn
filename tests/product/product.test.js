import request from "supertest";
import app from "../../src/app";
import {
  successRegistration,
  theSuccessLoginCredentials,
  unSuccessfullLoginCredentials,
} from "../mocks/user.mock";

import product from "../mocks/product.mock";
import { expect, describe, test } from "@jest/globals";

let userTokens = "";
let userUuid = "";
const uuidRegex = new RegExp(
  "^[a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$",
  "i"
);

describe("Product Test ( Create product)", () => {
  /*
   **********************************************
   *  🟢 Create new product*
   **********************************************
   */
  test("Successful Signup", async () => {
    const response = await request(app)
      .post("/api/v1/user/signup")
      .send(successRegistration);
    const token = response.body.data.userToken;

    userTokens = token;
    expect(response.statusCode).toBe(200);
  });

  test("Successful Verification", async () => {
    const response = await request(app).get(
      `/api/v1/user/signup/${userTokens}`
    );
    expect(response.statusCode).toBe(201);
    expect(response.body.data).toHaveProperty("uuid");
    expect(response.body.data.uuid).toMatch(uuidRegex);

    userUuid = response.body.data.uuid;
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
  test("Successful Login", async () => {
    const response = await request(app)
      .post("/api/v1/user/login")
      .send(theSuccessLoginCredentials);
    expect(response.statusCode).toBe(200);
  });

  // Login for unverified User

  test("Unsuccessful Login", async () => {
    const response = await request(app)
      .post("/api/v1/user/login")
      .send(unSuccessfullLoginCredentials);
    expect(response.statusCode).toBe(401);
  });
  /*
   **********************************************
   * 🛑 End login test *
   **********************************************
   */
  const token = response.body.data.userToken;
  expect(token).toBeDefined();

  // Decode the token payload
  const payload = jwt.decode(token);
  expect(payload).toBeDefined();

  // Check if the role in the payload is "seller"
  const role = payload.role;
  expect(role).toBeDefined();
  expect(role).toBe(2);

  // Set the token as an authorization header for the next request
  const authHeader = `Bearer ${token}`;

  // Test the product endpoint with the authorization header
  test("Successful added product", async () => {
    const response = await request(app)
      .post("/api/v1/product/create")
      .set("Authorization", authHeader)
      .send(product);
    expect(response.statusCode).toBe(201);
  });
});
