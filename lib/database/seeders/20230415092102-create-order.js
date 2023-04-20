'use strict';

const {
  v4: uuidv4
} = require('uuid');
const {
  UUIDV4
} = require('sequelize');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Orders", [{
      uuid: uuidv4(),
      product_id: uuidv4(),
      user_id: uuidv4(),
      quantity: 2,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },
  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};