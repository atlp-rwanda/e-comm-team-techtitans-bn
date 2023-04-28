"use strict";
const { v4: uuidv4 } = require("uuid");
const { UUIDV4 } = require("sequelize");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Orders",
      [
        {
          id: "daa7ea52-71e7-412d-b250-8a0cf3dd8245",
          productId: uuidv4(),
          userId: uuidv4(),
          quantity: 200,
          status: "pending",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
