"use strict";

const {
  v4: uuidv4
} = require("uuid");
const {
  UUIDV4
} = require("sequelize");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Orders", [{
      id: "c79bcfcb-704a-4fda-a2c1-098ac6d049e6",
      userId: "3acbab4a-6c19-4d72-885a-9e99bdc4cd42",
      cartId: "6a5df8f3-6f89-4a39-8e5e-8d1412c5d5f1",
      total_price: 15.99,
      quantity: 200,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Orders", null, {});
  }
};