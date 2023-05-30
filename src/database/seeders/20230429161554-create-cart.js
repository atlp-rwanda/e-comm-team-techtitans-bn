'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Carts",
      [
        {
          id: "daa7ea52-71e7-412d-b250-8a0cf3dd8250",
          quantity:1,
          userId: "daa7ea52-71e7-412d-b250-8a0cf3dd8270",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        
      ],
      {}
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Carts", null, {});
  }
};
