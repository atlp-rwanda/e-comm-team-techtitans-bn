import request from "supertest";
import app from "../../src/app";
import { expect, describe, test } from "@jest/globals";
import { Sequelize } from "../../src/database/models";
import { execSync } from "child_process";
import db from "../../src/database/models";
import passwordReminder from "../../src/controllers/user/password.reminder";

describe("users will be able to update their password", () => {
   beforeAll(async () => {
    // run seed before running the test
     await execSync("npx sequelize-cli db:seed --seed 20230322155518-techtitans.js");
   });

  test("changing password successfully", async () => {
    const User = db.users;
    const user = await User.findOne({
      where: { id: "daa7ea52-71e7-412d-b250-8a0cf3dd8270" },
    });
    let id = user.id;
    const newData=({
            old_password:"Password@123",
            new_password:"password@123",
            confirm_password:"password@123"
    })
    const path = `/api/v1/user/editpassword/${id}`;
    const response = await request(app)
      .put(path)
    .send(newData)
    expect(response.statusCode).toBe(200);
    //expect(response.body.data.status).toBe("shipped");
  });

  test("test if the body has oldPassword, newPassword and confirmPassword", async () => {
    const User = db.users;
    const user = await User.findOne({
      where: { id: "daa7ea52-71e7-412d-b250-8a0cf3dd8270" },
    });
    let id = user.id;
    const newData=({
            old_password:"Password@123",
            new_password:"",
            confirm_password:""
    })
    const path = `/api/v1/user/editpassword/${id}`;
    const response = await request(app)
      .put(path)
    .send(newData)
    expect(response.statusCode).toBe(401);
    //expect(response.body.data.status).toBe("shipped");
  });

  test("test for the user who is not in the database", async () => {
   const id='daa7ea52-71e7-412d-b250-8a0cf3dd8244';
    const newData=({
      old_password:"Password@123",
      new_password:"password@123",
      confirm_password:"password@123"
})
    const path = `/api/v1/user/editpassword/${id}`;
    const response = await request(app)
      .put(path)
    .send(newData)
    expect(response.statusCode).toBe(401);
    //expect(response.body.data.status).toBe("shipped");
  });
  test("test for when the old password is incorrect", async () => {
    const User = db.users;
    const user = await User.findOne({
      where: { id: "daa7ea52-71e7-412d-b250-8a0cf3dd8270" },
    });
    let id = user.id;
     const newData=({
       old_password:"Password@111",
       new_password:"password@123",
       confirm_password:"password@123"
 })
     const path = `/api/v1/user/editpassword/${id}`;
     const response = await request(app)
       .put(path)
     .send(newData)
     expect(response.statusCode).toBe(401);
     //expect(response.body.data.status).toBe("shipped");
   });

   test("test for password validity", async () => {
    const User = db.users;
    const user = await User.findOne({
      where: { id: "daa7ea52-71e7-412d-b250-8a0cf3dd8270" },
    });
    let id = user.id;
     const newData=({
       old_password:"Password@111",
       new_password:"",
       confirm_password:""
 })
     const path = `/api/v1/user/editpassword/${id}`;
     const response = await request(app)
       .put(path)
     .send(newData)
     expect(response.statusCode).toBe(401);
     //expect(response.body.data.status).toBe("shipped");
   });

   test("test if newpassword matches confirm password", async () => {
    const User = db.users;
    const user = await User.findOne({
      where: { id: "daa7ea52-71e7-412d-b250-8a0cf3dd8270" },
    });
    let id = user.id;
     const newData=({
       old_password:"Password@111",
       new_password:"password@123",
       confirm_password:"password@111"
 })
     const path = `/api/v1/user/editpassword/${id}`;
     const response = await request(app)
       .put(path)
     .send(newData)
     expect(response.statusCode).toBe(401);
     //expect(response.body.data.status).toBe("shipped");
   });
  afterAll(async() => {
    passwordReminder.stop();
    await execSync("npx sequelize-cli db:seed:undo --seed 20230322155518-techtitans.js");
  });
});