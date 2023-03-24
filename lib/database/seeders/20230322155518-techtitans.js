'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [{
      fullname: "richard",
      email: "richard@gmail.com",
      password: "richard123",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
    await queryInterface.bulkInsert('Carts', [{
      product_id: "product1",
      user_id: "user1",
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
    await queryInterface.bulkInsert('Products', [{
      name: "macbook",
      category_id: "category1",
      vendor_id: "vendor1",
      price: "500000",
      quantity: "100",
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
    await queryInterface.bulkInsert('Categories', [{
      name: "laptop",
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
    await queryInterface.bulkInsert('Orders', [{
      product_id: "product1",
      user_id: "user1",
      quantity: "50packets",
      status: "undelivered",
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