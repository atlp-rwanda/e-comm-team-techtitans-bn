"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Categories", [{
      id: "daa7ea52-71e7-412d-b250-8a0cf3dd8212",
      name: "electronics",
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: "c0445f5b-1a17-4ef9-a9cb-19675e6e1cf6",
      name: "clothes",
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: "d65dbd98-92b6-4f9d-bf1b-14b2a5821f9e",
      name: "furniture",
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Categories", null, {});
  }
};