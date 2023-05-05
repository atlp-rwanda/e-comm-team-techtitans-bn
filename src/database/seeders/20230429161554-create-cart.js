"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Carts",
      [
        {
          id: "daa7ea52-71e7-412d-b250-8a0cf3dd8250",
          quantity: 1,
          userId: "daa7ea52-71e7-412d-b250-8a0cf3dd8270",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "6a5df8f3-6f89-4a39-8e5e-8d1412c5d5f1",
          userId: "3acbab4a-6c19-4d72-885a-9e99bdc4cd42",
          quantity: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Carts", null, {});
  },
};
