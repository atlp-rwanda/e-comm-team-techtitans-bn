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
    await queryInterface.bulkInsert('Users', [{
      id: uuidv4(),
      fullname: 'richard',
      email: 'richard@gmail.com',
      //the hashed password below is 'Richard@123'
      password: '$2a$12$m8A9MqExqkOUgnKQcUqu1OfHlyPeF34uhB3ztnpdHP4UMLRnvlfuC',
      roleId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};