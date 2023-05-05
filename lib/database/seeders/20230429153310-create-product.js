"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Products", [{
      id: "daa7ea52-71e7-412d-b250-8a0cf3dd8267",
      name: "iPad",
      price: 2000,
      quantity: 27,
      categoryId: "daa7ea52-71e7-412d-b250-8a0cf3dd8212",
      description: "Made from quality Italian premium Leather",
      expiryDate: "2030-02-09",
      images: ["https://example.com/images/product1.jpg", "https://example.com/images/product1-thumb.jpg", "https://example.com/images/product2-thumb.jpg", "https://example.com/images/product3-thumb.jpg"],
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: "48d92c8b-540f-408c-a2ba-1be73fb8f31d",
      name: "Product 1",
      categoryId: "d65dbd98-92b6-4f9d-bf1b-14b2a5821f9e",
      vendorId: "c0445f5b-1a17-4ef9-a9cb-19675e6e1cf6",
      price: 10.99,
      quantity: 10,
      images: ["image1.jpg", "image2.jpg"],
      description: "Lorem ipsum dolor sit amet",
      bonus: 5,
      expiryDate: new Date("2023-12-31"),
      ec: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Products", null, {});
  }
};