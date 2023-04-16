import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../src/app";
import {
    sellerSuccessRegistration,
    theSuccessSellerLoginCredentials,
    unSuccessfullLoginCredentials,
    verifyOTP,
} from "../mocks/user.mock";
import product from "../mocks/product.mock";
import { expect, describe, test } from "@jest/globals";
import passwordReminder from "../../src/controllers/user/password.reminder";
// import db from "../../src/database/models";
// const Users = db.users;
// const user = Users.findOne({ where: { email } });
let userTokens = "";
let userUuid = "";
let sellerToken = "";
let otp = "";
const uuidRegex = new RegExp(
    "^[a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$",
    "i"
);
beforeAll(() => {
    passwordReminder.start();
});

afterAll(() => {
    passwordReminder.stop();
});
describe("Product Test ( Create product)", () => {
    /*
     **********************************************
     *  :large_green_circle: Create new product*
     **********************************************
     */
    test("Successful Signup", async () => {
        const response = await request(app)
            .post("/api/v1/user/signup")
            .send(sellerSuccessRegistration);
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
     * :octagonal_sign: End Signup a new User *
     **********************************************
     */
    /*
     **********************************************
     *  :large_green_circle: Login for verified User *
     **********************************************
     */
    test("Successful Login", async () => {
        const response = await request(app)
            .post("/api/v1/user/login")
            .send(theSuccessSellerLoginCredentials);
        expect(response.statusCode).toBe(202);
        // const token = response.body.data.userToken;
        // sellerToken = token;
    });
    test("Verify OTP", async () => {
        const otpData = await verifyOTP();
        const response = await request(app)
            .post("/api/v1/user/login/verifyOtp")
            .send(otpData);
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
     * :octagonal_sign: End login test *
     **********************************************
     */
    // Test the product endpoint with the authorization header
    //   test("Successful added product", async () => {
    //     // Decode the token payload
    //     const payload = jwt.decode(sellerToken);
    //     expect(payload).toBeDefined();
    //     // Check if the roleId in the payload is "seller"
    //     const roleId = payload.roleId;
    //     expect(roleId).toBeDefined();
    //     expect(roleId).toBe(2);
    //     // Set the token as an authorization header for the next request
    //     const authHeader = `Bearer ${sellerToken}`;
    //     const response = await request(app)
    //       .post("/api/v1/product/create")
    //       .set("Authorization", authHeader)
    //       .send(product);
    //     expect(response.statusCode).toBe(201);
    //   });
});
