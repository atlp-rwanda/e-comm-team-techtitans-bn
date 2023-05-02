"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Carts", [
      {
        id: "6a5df8f3-6f89-4a39-8e5e-8d1412c5d5f1",
        userId: "3acbab4a-6c19-4d72-885a-9e99bdc4cd42",
        quantity: 3,
        total: 56,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Carts", null, {});
  },
};
