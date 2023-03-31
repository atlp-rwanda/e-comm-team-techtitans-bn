"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Users", [{
      fullname: "richard",
      email: "richard@gmail.com",
      //the hashed password below is 'richard123'
      password: "$2y$10$7a52OC6C3uCvK7nm64efXejZaaTxd04jzgFoaKVJrJt8bhsJGfpKC",
      role: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
    await queryInterface.bulkInsert("Carts", [{
      product_id: "product1",
      user_id: "user1",
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
    await queryInterface.bulkInsert("Products", [{
      name: "macbook",
      category_id: "category1",
      vendor_id: "vendor1",
      price: "500000",
      quantity: "100",
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
    await queryInterface.bulkInsert("Categories", [{
      name: "laptop",
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
    await queryInterface.bulkInsert("Orders", [{
      product_id: "product1",
      user_id: "user1",
      quantity: "50packets",
      status: "undelivered",
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
    await queryInterface.bulkDelete("Carts", null, {});
    await queryInterface.bulkDelete("Categories", null, {});
    await queryInterface.bulkDelete("Products", null, {});
    await queryInterface.bulkDelete("Orders", null, {});
  }
};